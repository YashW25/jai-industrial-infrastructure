import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { UserProfile, AppRole } from '@/types/database';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: string | null | 'user';
  isClubAdmin: boolean;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; role?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  session: null,
  profile: null,
  role: null,
  isClubAdmin: false,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => { },
  refreshProfile: async () => { },
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<string | null | 'user'>(null);
  const [isClubAdmin, setIsClubAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (_userId: string) => {
    // user_profiles table does not exist in the current schema.
    // Profile stays null; all consumers already handle this gracefully.
    setProfile(null);
  };

  const fetchRole = async (userId: string) => {
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (userRoles && userRoles.length > 0) {
      const roles = userRoles.map(r => r.role);
      if (roles.includes('super_admin')) setRole('super_admin');
      else if (roles.includes('admin')) setRole('admin');
      else if (roles.includes('editor')) setRole('editor');
      else setRole('user');
    } else {
      setRole('user');
    }
  };

  useEffect(() => {
    let initialized = false;

    // Handle auth state changes AFTER initial session is established
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Skip the very first event — getSession() handles the initial state
        if (!initialized) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchRole(session.user.id);
        } else {
          setProfile(null);
          setRole(null);
        }
        setLoading(false);
      }
    );

    // Initial session check: drives the app's first render state
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      initialized = true; // Allow onAuthStateChange to handle future events
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        // Await role — ProtectedRoute must never see user + null-role
        await fetchRole(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error };

    // Fetch role after sign in (same logic as fetchRole — handles multiple rows)
    if (data.user) {
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id);

      const roles = rolesData?.map(r => r.role) || [];
      let userRole = 'user';
      if (roles.includes('super_admin')) userRole = 'super_admin';
      else if (roles.includes('admin')) userRole = 'admin';
      else if (roles.includes('editor')) userRole = 'editor';

      setRole(userRole);
      return { error: null, role: userRole };
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
    setIsClubAdmin(false);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
      await fetchRole(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        isClubAdmin,
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

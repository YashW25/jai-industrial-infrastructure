import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

import type { AppRole } from '@/types/database';

interface RBACState {
    role: AppRole | null;
    loading: boolean;
    error: string | null;
    isSuperAdmin: boolean;
    isPlatformAdmin: boolean;
    isClubAdmin: boolean;
    isEditor: boolean;
    isMember: boolean;
    isStudent: boolean;
    hasAccess: (allowedRoles: AppRole[]) => boolean;
}

export const useRBAC = (): RBACState => {
    
    const [role, setRole] = useState<AppRole | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRole = async () => {
            try {
                setLoading(true);
                const { data: { session }, error: authError } = await supabase.auth.getSession();

                if (authError) throw authError;
                if (!session?.user) {
                    setRole(null);
                    setLoading(false);
                    return;
                }

                // Fetch user role for this specific club OR global super_admin
                const { data: roles, error: rolesError } = await supabase
                    .from('user_roles')
                    .select('role, club_id')
                    .eq('user_id', session.user.id);

                if (rolesError) throw rolesError;

                if (roles && roles.length > 0) {
                    // Check for super_admin or platform_admin which might not be tied to a specific club
                    const globalAdmin = roles.find(r => r.role === 'super_admin' || r.role === 'platform_admin');
                    if (globalAdmin) {
                        setRole(globalAdmin.role as AppRole);
                        return;
                    }

                    // Check for club-specific role
                    if (clubId) {
                        const clubRole = roles.find(r => r.club_id === clubId);
                        if (clubRole) {
                            setRole(clubRole.role as AppRole);
                            return;
                        }
                    }

                    // Fallback to highest student/member role if not matching specific club (e.g. cross-platform visitor)
                    setRole('student');
                } else {
                    setRole('student');
                }
            } catch (err: any) {
                console.error('Error fetching RBAC role:', err);
                setError(err.message);
                setRole(null);
            } finally {
                setLoading(false);
            }
        };

        fetchRole();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            fetchRole();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [clubId]);

    const hasAccess = (allowedRoles: AppRole[]) => {
        if (!role) return false;
        // super_admin overrides everything
        if (role === 'super_admin') return true;
        return allowedRoles.includes(role);
    };

    return {
        role,
        loading,
        error,
        isSuperAdmin: role === 'super_admin',
        isPlatformAdmin: role === 'platform_admin',
        isClubAdmin: role === 'club_admin' || role === 'super_admin' || role === 'platform_admin',
        isEditor: hasAccess(['editor', 'club_admin', 'platform_admin', 'super_admin']),
        isMember: hasAccess(['member', 'editor', 'club_admin', 'platform_admin', 'super_admin']),
        isStudent: hasAccess(['student', 'member', 'editor', 'club_admin', 'platform_admin', 'super_admin']),
        hasAccess,
    };
};

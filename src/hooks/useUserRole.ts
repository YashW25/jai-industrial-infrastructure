import { useAuth } from '@/contexts/AuthContext';

export function useUserRole() {
    const { role, loading, user } = useAuth();

    return {
        role,
        loading,
        isAuthenticated: !!user,
        isSuperAdmin: role === 'super_admin',
        isAdmin: role === 'admin' || role === 'super_admin',
        isEditor: role === 'editor' || role === 'admin' || role === 'super_admin',
        isUser: role === 'user',
    };
}

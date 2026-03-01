import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { Loader2 } from 'lucide-react';

export function SuperAdminRoute() {
    const { role, loading, isAuthenticated } = useUserRole();
    const location = useLocation();

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-900">
                <Loader2 className="h-8 w-8 animate-spin text-red-500" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/admin" state={{ from: location }} replace />;
    }

    if (role === 'super_admin') {
        return <Outlet />;
    }

    // Admin/editor trying super-admin route → redirect to their dashboard
    if (role === 'admin' || role === 'editor') {
        return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/auth/admin" replace />;
}

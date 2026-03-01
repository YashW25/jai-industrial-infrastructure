import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute() {
    const { role, loading, isAuthenticated } = useUserRole();
    const location = useLocation();

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/admin" state={{ from: location }} replace />;
    }

    // Allow access to /admin if the user is a super_admin, admin, or editor
    if (role === 'super_admin' || role === 'admin' || role === 'editor') {
        return <Outlet />;
    }

    // Deny access and redirect to homepage if they have no admin rights
    return <Navigate to="/" replace />;
}

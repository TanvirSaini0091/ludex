import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const PublicRoute = () => {
    const { isAuthenticated, isLoading } = useAuth(); 

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background text-primary font-mono uppercase tracking-widest text-xs">
                <span className="animate-pulse">Verifying_State...</span>
            </div>
        );
    }

    // If the user IS authenticated, forcefully bounce them to the dashboard
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};
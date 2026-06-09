import { useAuth } from '@/context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';


export const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[#050505] text-[#ccff00] font-mono uppercase tracking-widest text-xs">
                <span className="animate-pulse">Authenticating_Signal...</span>
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    steamId: string;
    displayName: string;
    avatar: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Placeholder: Later, we will fetch to our /api/auth/me route here 
        // to check if the user has a valid HttpOnly cookie session.
        const checkSession = async () => {
            setIsLoading(false);
        };
        checkSession();
    }, []);

    const login = (userData: User) => setUser(userData);
    
    const logout = () => {
        setUser(null);
        // Later: call backend /api/auth/logout to destroy the cookie
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
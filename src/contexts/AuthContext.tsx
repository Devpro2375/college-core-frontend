import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '../types';
import { loginUser, registerUser, getProfile, completeOnboardingApi } from '../services/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (data: { name: string; email: string; password: string }) => Promise<void>;
    logout: () => void;
    completeOnboarding: (data: { branch?: string; year?: number; interests?: string[] }) => Promise<void>;
    isAuthenticated: boolean;
    isOnboardingComplete: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Fetch profile on mount if token exists
    useEffect(() => {
        async function loadUser() {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const { user: profile } = await getProfile();
                setUser(profile);
            } catch {
                // Token invalid – clean up
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        loadUser();
    }, [token]);

    const login = async (email: string, password: string) => {
        const result = await loginUser(email, password);
        localStorage.setItem('token', result.token);
        setToken(result.token);
        setUser(result.user);
    };

    const signup = async (data: { name: string; email: string; password: string }) => {
        const result = await registerUser(data);
        localStorage.setItem('token', result.token);
        setToken(result.token);
        setUser(result.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const completeOnboarding = async (data: { branch?: string; year?: number; interests?: string[] }) => {
        const { user: updated } = await completeOnboardingApi(data);
        setUser(updated);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                signup,
                logout,
                completeOnboarding,
                isAuthenticated: !!user,
                isOnboardingComplete: !!user?.onboarding_complete,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { BrowserProvider } from 'ethers';

interface User {
    email?: string;
    address?: string;
    authMethod: 'email' | 'metamask';
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    loginWithMetaMask: () => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Check for existing session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // TODO: Replace with actual API call
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock validation
            if (email && password.length >= 6) {
                const newUser = { email, authMethod: 'email' as const };
                setUser(newUser);
                localStorage.setItem('user', JSON.stringify(newUser));
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // TODO: Replace with actual API call
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock validation
            if (email && password.length >= 6) {
                const newUser = { email, authMethod: 'email' as const };
                setUser(newUser);
                localStorage.setItem('user', JSON.stringify(newUser));
            } else {
                throw new Error('Invalid input');
            }
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithMetaMask = async () => {
        setIsLoading(true);
        try {
            if (!window.ethereum) {
                throw new Error('MetaMask is not installed');
            }

            const provider = new BrowserProvider(window.ethereum);
            const accounts = await provider.send('eth_requestAccounts', []);

            if (accounts.length > 0) {
                const address = accounts[0];
                const newUser = { address, authMethod: 'metamask' as const };
                setUser(newUser);
                localStorage.setItem('user', JSON.stringify(newUser));
            }
        } catch (error) {
            console.error('MetaMask login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                signup,
                loginWithMetaMask,
                logout,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Declare window.ethereum for TypeScript
declare global {
    interface Window {
        ethereum?: any;
    }
}

/**
 * Authentication Context
 *
 * Manages authentication state across the application
 * - Stores userId and token in localStorage
 * - Provides login/logout methods
 * - Auto-restores session on app load
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { authService } from '../api/services/auth.service';
import { he } from '../locales/he';

interface AuthContextType {
  userId: string | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Auto-restore session from localStorage on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      setUserId(savedUserId);
    }
    setLoading(false);
  }, []);

  /**
   * Login with email (and optional name)
   * Calls backend API, stores token and userId in localStorage
   */
  const login = async (email: string, name?: string) => {
    try {
      const response = await authService.login({ email, name });

      // Store auth data in localStorage
      localStorage.setItem('userId', response.user.id);
      localStorage.setItem('authToken', response.accessToken);

      // Update state
      setUserId(response.user.id);

      // Show success toast
      toast.success(he.success.loginSuccess);
    } catch (error) {
      // Error toast already shown by API client
      throw error;
    }
  };

  /**
   * Logout
   * Clears localStorage and resets state
   */
  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');
    setUserId(null);
  };

  const value: AuthContextType = {
    userId,
    isAuthenticated: !!userId,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * Throws error if used outside AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
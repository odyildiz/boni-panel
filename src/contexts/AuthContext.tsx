import { createContext, useContext, useState, ReactNode } from 'react';
import { createAuthService } from '../services/authService';

const authService = createAuthService();

interface AuthContextType {
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<string>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem('accessToken')
  );

  const refreshAccessToken = async () => {
    try {
      const tokens = await authService.refreshTokens();
      if (tokens.accessToken) {
        setAccessToken(tokens.accessToken);
        return tokens.accessToken;
      }
      throw new Error('No access token received');
    } catch (error) {
      console.error('Failed to refresh token:', error);
      authService.logout();
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const tokens = await authService.login({ email, password });
      setAccessToken(tokens.accessToken);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setAccessToken(null);
  };

  const value = {
    accessToken,
    login,
    logout,
    refreshAccessToken,
    isAuthenticated: !!accessToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
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
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const refreshAccessToken = async () => {
    try {
      setRefreshToken(authService.getRefreshTokenFromCookie());
      if (refreshToken) {
        const tokens = await authService.refreshTokens(refreshToken);
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
      } else {
        setAccessToken(null);
        setRefreshToken(null);
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      setAccessToken(null);
      setRefreshToken(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const tokens = await authService.login({ email, password });
      setAccessToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);
    } catch (error) {
      refreshAccessToken();
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setAccessToken(null);
    setRefreshToken(null);
  };

  useEffect(() => {
    refreshAccessToken();
  }, []);

  const value = {
    accessToken,
    login,
    logout,
    isAuthenticated: !!accessToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
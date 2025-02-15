import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  const [refreshTokenTimeout, setRefreshTokenTimeout] = useState<NodeJS.Timeout>();

  const startRefreshTokenTimer = (expiresIn: number) => {
    const timeout = setTimeout(refreshAccessToken, (expiresIn - 60) * 1000);
    setRefreshTokenTimeout(timeout);
  };

  const stopRefreshTokenTimer = () => {
    if (refreshTokenTimeout) {
      clearTimeout(refreshTokenTimeout);
      setRefreshTokenTimeout(undefined);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = authService.getRefreshTokenFromCookie();
      if (refreshToken) {
        const tokens = await authService.refreshTokens(refreshToken);
        setAccessToken(tokens.accessToken);
        startRefreshTokenTimer(3600); // Assuming token expires in 1 hour
      } else {
        setAccessToken(null);
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      setAccessToken(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const tokens = await authService.login({ email, password });
      setAccessToken(tokens.accessToken);
      startRefreshTokenTimer(3600); // Assuming token expires in 1 hour
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setAccessToken(null);
    stopRefreshTokenTimer();
  };

  useEffect(() => {
    refreshAccessToken();
    return () => {
      stopRefreshTokenTimer();
    };
  }, []);

  const value = {
    accessToken,
    login,
    logout,
    isAuthenticated: !!accessToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
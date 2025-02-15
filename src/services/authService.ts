interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const API_URL = 'http://localhost:8080';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    const response = await fetch(`${API_URL}/panel/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const tokens = await response.json();
    document.cookie = `refreshToken=${tokens.refreshToken}; path=/; HttpOnly; SameSite=Strict`;
    return tokens;
  },

  refreshTokens: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await fetch(`${API_URL}/panel/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const tokens = await response.json();
    document.cookie = `refreshToken=${tokens.refreshToken}; path=/; HttpOnly; SameSite=Strict`;
    return tokens;
  },

  getRefreshTokenFromCookie: (): string | null => {
    const cookies = document.cookie.split(';');
    const refreshTokenCookie = cookies.find(cookie => cookie.trim().startsWith('refreshToken='));
    return refreshTokenCookie ? refreshTokenCookie.split('=')[1] : null;
  },

  logout: (): void => {
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};
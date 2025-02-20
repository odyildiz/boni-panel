interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthTokens {
  accessToken: string;
}

function storeTokens(tokens: AuthTokens) {
  localStorage.setItem('accessToken', tokens.accessToken);
}

const API_URL = 'http://localhost:8080';

export function createAuthService() {

  return {
    login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
      const response = await fetch(`${API_URL}/panel/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const tokens = await response.json();
      storeTokens(tokens);
      return tokens;
    },

    refreshTokens: async (): Promise<AuthTokens> => {
      const response = await fetch(`${API_URL}/panel/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const tokens = await response.json();
      storeTokens(tokens);
      return tokens;
    },

    logout: (): void => {
      localStorage.removeItem('accessToken');
    }
  };
};
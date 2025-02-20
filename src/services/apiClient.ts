const API_URL = 'http://localhost:8080';

interface RequestConfig extends RequestInit {
  skipAuthRefresh?: boolean
}

export async function apiClient(endpoint: string, config: RequestConfig = {}, accessToken: string | null = null, csrfToken: string | null = null) {
  const headers = new Headers(config.headers || {});

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  if ('GET' != config.method && csrfToken) {
    headers.set('X-CSRF-TOKEN', csrfToken);
  }

  headers.set('Content-Type', 'application/json');

  const requestConfig = {
    ...config,
    headers
  };

  try {
    return await fetch(`${API_URL}${endpoint}`, requestConfig);
  } catch (error) {
    throw error;
  }
}
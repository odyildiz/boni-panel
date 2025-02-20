import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../services/apiClient';

interface RequestConfig extends RequestInit {
  skipAuthRefresh?: boolean;
}

export function useApi() {
  const { accessToken, refreshAccessToken, getCsrfToken } = useAuth();

  const request = async (endpoint: string, config: RequestConfig = {}) => {
    try {
      const csrfToken = await getCsrfToken();
      const response = await apiClient(endpoint, config, accessToken, csrfToken);

      if (response.status === 403) {
        const newToken = await refreshAccessToken();
        return await apiClient(endpoint, config, newToken, csrfToken);
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    get: (endpoint: string, config?: RequestConfig) => 
      request(endpoint, { ...config, method: 'GET'}),
    post: (endpoint: string, data?: any, config?: RequestConfig) =>
      request(endpoint, { ...config, method: 'POST', body: JSON.stringify(data) }),
    put: (endpoint: string, data?: any, config?: RequestConfig) =>
      request(endpoint, { ...config, method: 'PUT', body: JSON.stringify(data) }),
    delete: (endpoint: string, config?: RequestConfig) =>
      request(endpoint, { ...config, method: 'DELETE' })
  };
}
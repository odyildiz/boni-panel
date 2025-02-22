import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../services/apiClient';

interface RequestConfig extends RequestInit {
  skipAuthRefresh?: boolean;
}

export function useApi() {
  const { accessToken, refreshAccessToken } = useAuth();

  const request = async (endpoint: string, config: RequestConfig = {}) => {
    try {
      var response = await apiClient(endpoint, config, accessToken);

      if (response.status === 403) {
        const newToken = await refreshAccessToken();
        response = await apiClient(endpoint, config, newToken);
      }

      if (response.status === 403) {
        alert('İşlem esnasında bir hata gerçekleşti!');
      }

      return response;
    } catch (error) {
      alert('İşlem esnasında bir hata gerçekleşti!');
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
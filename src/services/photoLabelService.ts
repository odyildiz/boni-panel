import { useApi } from '../hooks/useApi';

export interface PhotoLabelDto {
  id: string;
  nameTr: string;
  nameEn: string;
}

export interface AddPhotoLabelRequest {
  nameTr: string;
  nameEn: string;
}

export interface UpdatePhotoLabelRequest {
  nameTr: string;
  nameEn: string;
}

export function usePhotoLabelService() {
  const api = useApi();

  const getAll = async (): Promise<PhotoLabelDto[]> => {
    const response = await api.get('/gallery/photo/label/list');
    return response.json();
  };

  const create = async (request: AddPhotoLabelRequest): Promise<void> => {
    await api.post('/gallery/photo/label/add', request);
  };

  const update = async (id: string, request: UpdatePhotoLabelRequest): Promise<void> => {
    await api.put(`/gallery/photo/label/${id}`, request);
  };

  const remove = async (id: string): Promise<void> => {
    await api.delete(`/gallery/photo/label/${id}`);
  };

  return {
    getAll,
    create,
    update,
    remove,
  };
}
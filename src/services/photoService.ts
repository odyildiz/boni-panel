import { useApi } from '../hooks/useApi';

export interface GalleryPhotoDto {
  id: string;
  imageUrl: string;
  titleTr: string;
  titleEn: string;
  descriptionTr: string;
  descriptionEn: string;
}

export interface AddPhotoRequest {
  imageUrl: string;
  titleTr: string;
  titleEn: string;
  descriptionTr: string;
  descriptionEn: string;
}

export interface UpdatePhotoRequest {
  titleTr: string;
  titleEn: string;
  descriptionTr: string;
  descriptionEn: string;
  imageUrl: string;
}

export function usePhotoService() {
  const api = useApi();

  const getAll = async (): Promise<GalleryPhotoDto[]> => {
    const response = await api.get('/gallery/photo/list');
    return response.json();
  };

  const create = async (request: AddPhotoRequest): Promise<void> => {
    await api.post('/gallery/photo/add', request);
  };

  const update = async (id: string, request: UpdatePhotoRequest): Promise<void> => {
    await api.put(`/gallery/photo/${id}`, request);
  };

  const remove = async (id: string): Promise<void> => {
    await api.delete(`/gallery/photo/${id}`);
  };

  return {
    getAll,
    create,
    update,
    remove,
  };
}
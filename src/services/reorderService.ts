import { useApi } from '../hooks/useApi';

export function useReorderService() {
  const api = useApi();

  return {
    reorderMenuCategories: async (orderedIds: string[]): Promise<void> => {
      try {
        await api.post('/menu/category/reorder', { orderedIds });
      } catch (error) {
        console.error('Error reordering menu categories:', error);
        throw error;
      }
    },

    reorderMenuItems: async (categoryId: string, orderedIds: string[]): Promise<void> => {
      try {
        await api.post(`/menu/item/reorder/${categoryId}`, { orderedIds });
      } catch (error) {
        console.error('Error reordering menu items:', error);
        throw error;
      }
    },

    reorderGalleryPhotos: async (orderedIds: string[]): Promise<void> => {
      try {
        await api.post('/gallery/photo/reorder', { orderedIds });
      } catch (error) {
        console.error('Error reordering gallery photos:', error);
        throw error;
      }
    }
  };
}
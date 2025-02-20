import { useApi } from '../hooks/useApi';

interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  nameEn: string;
  price1: number;
  price2: number;
}

export function useMenuItemService() {
  const api = useApi();

  return {
    getAll: async (categoryId: string): Promise<MenuItem[]> => {
      try {
        const response = await api.get(`/menu/items/${categoryId}`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching menu items:', error);
        throw error;
      }
    },

    create: async (categoryId: string, name: string, nameEn: string, price1: number, price2: number): Promise<MenuItem> => {
      try {
        const response = await api.post('/menu/items/add', {
          categoryId,
          name,
          nameEn,
          price1,
          price2
        });
        return response.json();
      } catch (error) {
        console.error('Error creating menu item:', error);
        throw error;
      }
    },

    update: async (id: string, name: string, nameEn: string, price1: number, price2: number): Promise<MenuItem> => {
      try {
        const response = await api.put(`/menu/items/${id}`, {
          name,
          nameEn,
          price1,
          price2
        });
        return response.json();
      } catch (error) {
        console.error('Error updating menu item:', error);
        throw error;
      }
    },

    delete: async (id: string): Promise<void> => {
      try {
        await api.delete(`/menu/items/${id}`);
      } catch (error) {
        console.error('Error deleting menu item:', error);
        throw error;
      }
    }
  };
}
import { useApi } from '../hooks/useApi';

interface MenuItem {
  id: string;
  categoryId: string;
  nameTr: string;
  nameEn: string;
  price1: number;
  price2: number;
}

export function useMenuItemService() {
  const api = useApi();

  return {
    getAll: async (categoryId: string): Promise<MenuItem[]> => {
      try {
        const response = await api.get(`/menu/item/list/${categoryId}`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching menu items:', error);
        throw error;
      }
    },

    create: async (categoryId: string, nameTr: string, nameEn: string, price1: number, price2: number): Promise<void> => {
      try {
        await api.post(`/menu/item/add/${categoryId}`, {
          nameTr,
          nameEn,
          price1,
          price2
        });
      } catch (error) {
        console.error('Error creating menu item:', error);
        throw error;
      }
    },

    update: async (id: string, nameTr: string, nameEn: string, price1: number, price2: number): Promise<void> => {
      try {
        await api.put(`/menu/item/${id}`, {
          nameTr,
          nameEn,
          price1,
          price2
        });

      } catch (error) {
        console.error('Error updating menu item:', error);
        throw error;
      }
    },

    delete: async (id: string): Promise<void> => {
      try {
        await api.delete(`/menu/item/${id}`);
      } catch (error) {
        console.error('Error deleting menu item:', error);
        throw error;
      }
    }
  };
}
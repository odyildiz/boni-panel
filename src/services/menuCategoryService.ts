import { useApi } from '../hooks/useApi';

interface MenuCategory {
    id: string;
    slug: string;
    nameTr: string;
    nameEn: string;
}

export function useMenuCategoryService() {
    const api = useApi();

    return {
        getAll: async (): Promise<MenuCategory[]> => {
            try {
                const response = await api.get('/menu/category/list');
                return await response.json();
            } catch (error) {
                console.error('Error fetching categories:', error);
                throw error;
            }
        },

        create: async (nameTr: string, nameEn: string): Promise<MenuCategory> => {
            try {
                const response = await api.post('/menu/category/add', {
                    nameTr,
                    nameEn
                });
                return response.json();
            } catch (error) {
                console.error('Error creating category:', error);
                throw error;
            }
        },

        update: async (id: string, nameTr: string, nameEn: string): Promise<MenuCategory> => {
            try {
                const response = await api.put(`/menu/category/${id}`, {
                    nameTr,
                    nameEn
                });
                return response.json();
            } catch (error) {
                console.error('Error updating category:', error);
                throw error;
            }
        },

        delete: async (id: string): Promise<void> => {
            try {
                await api.delete(`/menu/category/${id}`);
            } catch (error) {
                console.error('Error deleting category:', error);
                throw error;
            }
        }
    }
}
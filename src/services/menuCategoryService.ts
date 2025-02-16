interface MenuCategory {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
}

const API_URL = 'http://localhost:8080';

export const menuCategoryService =  {
  getAll: async (accessToken: string): Promise<MenuCategory[]> => {
    if (!accessToken) throw new Error('No access token available');
    
    try {
      const response = await fetch(`${API_URL}/menu/category/list`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  create: async (accessToken: string, name: string, nameEn: string): Promise<MenuCategory> => {
    if (!accessToken) throw new Error('No access token available');

    try {
      const response = await fetch(`${API_URL}/menu/category/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ name, nameEn })
      });
      if (!response.ok) throw new Error('Failed to create category');
      return response.json();
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  update: async (accessToken: string, id: string, name: string, nameEn: string): Promise<MenuCategory> => {
    if (!accessToken) throw new Error('No access token available');

    try {
      const response = await fetch(`${API_URL}/menu/category/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ name, nameEn })
      });
      if (!response.ok) throw new Error('Failed to update category');
      return response.json();
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  delete: async (accessToken: string, id: string): Promise<void> => {
    if (!accessToken) throw new Error('No access token available');

    try {
      const response = await fetch(`${API_URL}/menu/category/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete category');
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
};
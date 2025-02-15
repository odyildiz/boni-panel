interface MenuCategory {
  id: string;
  name: string;
}

const STORAGE_KEY = 'menuCategories';

export const menuCategoryService = {
  getAll: (): MenuCategory[] => {
    const categories = localStorage.getItem(STORAGE_KEY);
    return categories ? JSON.parse(categories) : [];
  },

  create: (name: string, nameEn: string): MenuCategory => {
    const categories = menuCategoryService.getAll();
    const newCategory = {
      id: crypto.randomUUID(),
      name,
      nameEn
    };
    categories.push(newCategory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    return newCategory;
  },

  update: (id: string, name: string, nameEn: string): MenuCategory | null => {
    const categories = menuCategoryService.getAll();
    const categoryIndex = categories.findIndex(cat => cat.id === id);
    if (categoryIndex === -1) return null;

    const updatedCategory = { ...categories[categoryIndex], name, nameEn };
    categories[categoryIndex] = updatedCategory;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    return updatedCategory;
  },

  delete: (id: string): boolean => {
    const categories = menuCategoryService.getAll();
    const filteredCategories = categories.filter(cat => cat.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCategories));
    return categories.length !== filteredCategories.length;
  }
};
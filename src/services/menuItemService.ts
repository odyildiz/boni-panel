interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  nameEn: string;
  price1: number;
  price2: number;
}

const STORAGE_KEY = 'menuItems';

export const menuItemService = {
  getAll: (categoryId: string): MenuItem[] => {
    const items = localStorage.getItem(STORAGE_KEY);
    const allItems = items ? JSON.parse(items) : [];
    return allItems.filter((item: MenuItem) => item.categoryId === categoryId);
  },

  create: (categoryId: string, name: string, nameEn: string, price1: number, price2: number): MenuItem => {
    const newItem = {
      id: crypto.randomUUID(),
      categoryId,
      name,
      nameEn,
      price1,
      price2
    };
    const allItems = localStorage.getItem(STORAGE_KEY);
    const existingItems = allItems ? JSON.parse(allItems) : [];
    existingItems.push(newItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingItems));
    return newItem;
  },

  update: (id: string, name: string, nameEn: string, price1: number, price2: number): MenuItem | null => {
    const allItems = localStorage.getItem(STORAGE_KEY);
    const items = allItems ? JSON.parse(allItems) : [];
    const itemIndex = items.findIndex((item: MenuItem) => item.id === id);
    if (itemIndex === -1) return null;

    const updatedItem = { ...items[itemIndex], name, nameEn, price1, price2 };
    items[itemIndex] = updatedItem;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return updatedItem;
  },

  delete: (id: string): boolean => {
    const allItems = localStorage.getItem(STORAGE_KEY);
    const items = allItems ? JSON.parse(allItems) : [];
    const filteredItems = items.filter((item: MenuItem) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredItems));
    return items.length !== filteredItems.length;
  }
};
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { menuItemService } from '../services/menuItemService';
import { menuCategoryService } from '../services/menuCategoryService';

interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  price1: number;
  price2: number;
}

const MenuItems = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemNameEn, setNewItemNameEn] = useState('');
  const [newItemPrice1, setNewItemPrice1] = useState('');
  const [newItemPrice2, setNewItemPrice2] = useState('');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingItemName, setEditingItemName] = useState('');
  const [editingItemNameEn, setEditingItemNameEn] = useState('');
  const [editingItemPrice1, setEditingItemPrice1] = useState('');
  const [editingItemPrice2, setEditingItemPrice2] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (categoryId) {
      loadItems();
      loadCategoryName();
    }
  }, [categoryId]);

  const loadItems = () => {
    if (categoryId) {
      const allItems = menuItemService.getAll(categoryId);
      setItems(allItems);
    }
  };

  const loadCategoryName = () => {
    if (categoryId) {
      const categories = menuCategoryService.getAll();
      const category = categories.find(cat => cat.id === categoryId);
      if (category) {
        setCategoryName(category.name);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemNameEn.trim() || !newItemPrice1.trim() || !categoryId) return;

    const price1 = parseFloat(newItemPrice1);
    const price2 = parseFloat(newItemPrice2);

    if (isNaN(price1)) return;

    menuItemService.create(categoryId, newItemName, newItemNameEn, price1, price2);
    setNewItemName('');
    setNewItemNameEn('');
    setNewItemPrice1('');
    setNewItemPrice2('');
    loadItems();
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setEditingItemName(item.name);
    setEditingItemNameEn(item.nameEn);
    setEditingItemPrice1(item.price1.toString());
    setEditingItemPrice2(item.price2 ? item.price2.toString() : '');
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItemName.trim() || !editingItemNameEn.trim() || !editingItemPrice1.trim() || !editingItem) return;

    const price1 = parseFloat(editingItemPrice1);
    const price2 = parseFloat(editingItemPrice2);

    if (isNaN(price1)) return;

    menuItemService.update(editingItem.id, editingItemName, editingItemNameEn, price1, price2);
    setEditingItem(null);
    setEditingItemName('');
    setEditingItemNameEn('');
    setEditingItemPrice1('');
    setEditingItemPrice2('');
    setIsEditModalOpen(false);
    loadItems();
  };

  const handleEditCancel = () => {
    setEditingItem(null);
    setEditingItemName('');
    setEditingItemPrice1('');
    setEditingItemPrice2('');
    setIsEditModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu menü öğesini silmek istediğinizden emin misiniz?')) {
      menuItemService.delete(id);
      loadItems();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{categoryName}</h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-4 gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Menü Öğesi İsmi (Türkçe) *"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            value={newItemNameEn}
            onChange={(e) => setNewItemNameEn(e.target.value)}
            placeholder="Menu Item Name (English) *"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <input
            type="number"
            value={newItemPrice1}
            onChange={(e) => setNewItemPrice1(e.target.value)}
            placeholder="Fiyat 1 *"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <input
            type="number"
            value={newItemPrice2}
            onChange={(e) => setNewItemPrice2(e.target.value)}
            placeholder="Fiyat 2"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="col-span-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          >
            Ekle
          </button>
        </div>
      </form>

      <div className="bg-white rounded shadow">
        {items.length === 0 ? (
          <p className="p-4 text-gray-500">No items found</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {items.map((item) => (
              <li key={item.id} className="p-4 flex items-center justify-between">
                <div>
                  <div>
                    <span className="text-gray-900 font-medium">{item.name}</span>
                    <span className="text-gray-500 text-sm ml-2">({item.nameEn})</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="mr-4">Fiyat 1: ₺{item.price1}</span>
                    {item.price2 ? <span>Fiyat 2: ₺{item.price2}</span> : null}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                  >
                    Kaldır
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Menu Item</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <input
                  type="text"
                  value={editingItemName}
                  onChange={(e) => setEditingItemName(e.target.value)}
                  placeholder="Menü Öğesi İsmi (Türkçe) *"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  value={editingItemNameEn}
                  onChange={(e) => setEditingItemNameEn(e.target.value)}
                  placeholder="Menu Item Name (English) *"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="number"
                  value={editingItemPrice1}
                  onChange={(e) => setEditingItemPrice1(e.target.value)}
                  placeholder="Price 1 *"
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  value={editingItemPrice2}
                  onChange={(e) => setEditingItemPrice2(e.target.value)}
                  placeholder="Price 2"
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                >
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItems;
import React, {useState, useEffect} from 'react';
import {useMenuCategoryService} from '../services/menuCategoryService';
import {Link} from 'react-router-dom';

interface MenuCategory {
    id: string;
    nameTr: string;
    nameEn: string;
}

const MenuContent = () => {
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryNameEn, setNewCategoryNameEn] = useState('');
    const [editingCategoryName, setEditingCategoryName] = useState('');
    const [editingCategoryNameEn, setEditingCategoryNameEn] = useState('');
    const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const menuCategoryService = useMenuCategoryService();

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const allCategories = await menuCategoryService.getAll();
        setCategories(allCategories);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim() || !newCategoryNameEn.trim()) return;
        await menuCategoryService.create(newCategoryName, newCategoryNameEn);
        setNewCategoryName('');
        loadCategories();
    };

    const handleEdit = (category: MenuCategory) => {
        setEditingCategory(category);
        setEditingCategoryName(category.nameTr);
        setEditingCategoryNameEn(category.nameEn);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategoryName.trim() || !editingCategoryNameEn.trim() || !editingCategory) return;

        await menuCategoryService.update(editingCategory.id, editingCategoryName, editingCategoryNameEn);
        setEditingCategory(null);
        setEditingCategoryNameEn('');
        setIsEditModalOpen(false);
        loadCategories();
    };

    const handleEditCancel = () => {
        setEditingCategory(null);
        setEditingCategoryName('');
        setEditingCategoryNameEn('');
        setIsEditModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bu kategoriyle birlikte kategoriye bağlı tüm menü içerikleri silinecek. Onaylıyor musunuz?')) {
          await menuCategoryService.delete(id);
            setEditingCategoryName('');
            setEditingCategoryNameEn('');
            setIsEditModalOpen(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Menü Kategorileri</h1>

            <form onSubmit={handleSubmit} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Kategori İsmi Giriniz (Türkçe)"
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                    <input
                        type="text"
                        value={newCategoryNameEn}
                        onChange={(e) => setNewCategoryNameEn(e.target.value)}
                        placeholder="Enter Category Name (English)"
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="md:col-span-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                    >
                        Ekle
                    </button>
                </div>
            </form>

            <div className="bg-white rounded shadow">
                {categories.length === 0 ? (
                    <p className="p-4 text-gray-500">No categories found</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {categories.map((category) => (
                            <li key={category.id} className="p-4 flex items-center justify-between">
                                <Link to={`/menu-items/${category.id}`}
                                      className="text-gray-900 hover:text-blue-600">{category.nameTr}</Link>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none"
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
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
                        <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="grid grid-cols-1 gap-4 mb-4">
                                <input
                                    type="text"
                                    value={editingCategoryName}
                                    onChange={(e) => setEditingCategoryName(e.target.value)}
                                    placeholder="Kategori İsmi (Türkçe)"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                />
                                <input
                                    type="text"
                                    value={editingCategoryNameEn}
                                    onChange={(e) => setEditingCategoryNameEn(e.target.value)}
                                    placeholder="Category Name (English)"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
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

export default MenuContent;
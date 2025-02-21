import React, {useState, useEffect} from 'react';
import {useMenuCategoryService} from '../services/menuCategoryService';
import {Link} from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useReorderService } from '../services/reorderService';

interface MenuCategory {
    id: string;
    nameTr: string;
    nameEn: string;
    order?: number;
}

interface SortableItemProps {
    category: MenuCategory;
    onEdit: (category: MenuCategory) => void;
    onDelete: (id: string) => void;
}

const SortableItem = ({ category, onEdit, onDelete }: SortableItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: category.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li ref={setNodeRef} style={style} className="p-4 flex items-center justify-between bg-white">
            <div className="flex items-center gap-4 w-full">
                <button
                    className="cursor-grab touch-none"
                    {...attributes}
                    {...listeners}
                >
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                </button>
                <Link to={`/menu-items/${category.id}`} className="text-gray-900 hover:text-blue-600 flex-grow">
                    {category.nameTr}
                </Link>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(category)}
                        className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none"
                    >
                        Düzenle
                    </button>
                    <button
                        onClick={() => onDelete(category.id)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                    >
                        Kaldır
                    </button>
                </div>
            </div>
        </li>
    );
};

const MenuContent = () => {
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const reorderService = useReorderService();
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
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

    const handleDragEnd = async (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setCategories((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newOrder = arrayMove(items, oldIndex, newIndex);
                
                // Update the order in the backend
                reorderService.reorderMenuCategories(newOrder.map((item) => item.id));
                
                return newOrder;
            });
        }
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
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={categories}
                            strategy={verticalListSortingStrategy}
                        >
                            <ul className="divide-y divide-gray-200">
                                {categories.map((category) => (
                                    <SortableItem
                                        key={category.id}
                                        category={category}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </ul>
                        </SortableContext>
                    </DndContext>
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
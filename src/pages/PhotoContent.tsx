import { useState, useEffect } from 'react';
import { usePhotoService, GalleryPhotoDto, AddPhotoRequest, UpdatePhotoRequest, PhotoLabelDto } from '../services/photoService';
import { usePhotoLabelService } from '../services/photoLabelService';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useReorderService } from '../services/reorderService';
import { Link } from 'react-router-dom';

interface SortableItemProps {
  photo: GalleryPhotoDto;
  onEdit: (photo: GalleryPhotoDto) => void;
  onDelete: (id: string) => void;
}

const SortableItem = ({ photo, onEdit, onDelete }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded shadow overflow-hidden w-full flex h-32">
      <div className="flex items-center px-2">
        <button
          className="cursor-grab touch-none"
          {...attributes}
          {...listeners}
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>
      </div>
      <div className="w-40 h-full">
        <img
          src={photo.imageUrl}
          alt={photo.titleTr}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-gray-700 text-lg mb-1">{photo.titleTr}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{photo.descriptionTr}</p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(photo)}
            className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none"
          >
            Düzenle
          </button>
          <button
            onClick={() => onDelete(photo.id)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
          >
            Kaldır
          </button>
        </div>
      </div>
    </div>
  );
};

const PhotoContent = () => {
  const [photos, setPhotos] = useState<GalleryPhotoDto[]>([]);
  const [labels, setLabels] = useState<PhotoLabelDto[]>([]);
  const reorderService = useReorderService();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [newPhoto, setNewPhoto] = useState<AddPhotoRequest>({
    imageUrl: '',
    titleTr: '',
    titleEn: '',
    descriptionTr: '',
    descriptionEn: '',
    labelIds: []
  });
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhotoDto | null>(null);
  const [selectedLabelIds, setSelectedLabelIds] = useState<number[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const photoService = usePhotoService();
  const photoLabelService = usePhotoLabelService();

  useEffect(() => {
    loadPhotos();
    loadLabels();
  }, []);
  
  const loadLabels = async () => {
    try {
      const allLabels = await photoLabelService.getAll();
      setLabels(allLabels);
    } catch (error) {
      console.error('Error loading labels:', error);
    }
  };

  const loadPhotos = async () => {
    const allPhotos = await photoService.getAll();
    setPhotos(allPhotos);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPhoto(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleLabelChange = (labelId: number) => {
    setNewPhoto(prev => {
      const currentLabelIds = prev.labelIds || [];
      const updatedLabelIds = currentLabelIds.includes(labelId)
        ? currentLabelIds.filter(id => id !== labelId)
        : [...currentLabelIds, labelId];
      
      return {
        ...prev,
        labelIds: updatedLabelIds
      };
    });
  };
  
  const handleEditLabelChange = (labelId: number) => {
    const updatedLabelIds = selectedLabelIds.includes(labelId)
      ? selectedLabelIds.filter(id => id !== labelId)
      : [...selectedLabelIds, labelId];
    
    setSelectedLabelIds(updatedLabelIds);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingPhoto) {
      setEditingPhoto(prev => ({
        ...prev!,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.imageUrl.trim() || !newPhoto.titleTr.trim() || !newPhoto.titleEn.trim()) return;

    await photoService.create(newPhoto);
    setNewPhoto({
      imageUrl: '',
      titleTr: '',
      titleEn: '',
      descriptionTr: '',
      descriptionEn: '',
      labelIds: []
    });
    loadPhotos();
  };

  const handleEdit = (photo: GalleryPhotoDto) => {
    setEditingPhoto(photo);
    // Initialize selected label IDs from photo's labels if available
    const labelIds = photo.labels ? photo.labels.map(label => Number(label.id)) : [];
    setSelectedLabelIds(labelIds);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto || !editingPhoto.imageUrl.trim() || !editingPhoto.titleTr.trim() || !editingPhoto.titleEn.trim()) return;

    const updateRequest: UpdatePhotoRequest = {
      imageUrl: editingPhoto.imageUrl,
      titleTr: editingPhoto.titleTr,
      titleEn: editingPhoto.titleEn,
      descriptionTr: editingPhoto.descriptionTr,
      descriptionEn: editingPhoto.descriptionEn,
      labelIds: selectedLabelIds
    };

    await photoService.update(editingPhoto.id, updateRequest);
    setEditingPhoto(null);
    setIsEditModalOpen(false);
    loadPhotos();
  };

  const handleEditCancel = () => {
    setEditingPhoto(null);
    setIsEditModalOpen(false);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setPhotos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Update the order in the backend
        reorderService.reorderGalleryPhotos(newOrder.map((item) => item.id));
        
        return newOrder;
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu fotoğrafı silmek istediğinizden emin misiniz?')) {
      await photoService.remove(id);
      loadPhotos();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Fotoğraf İçeriği</h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            name="imageUrl"
            value={newPhoto.imageUrl}
            onChange={handleInputChange}
            placeholder="Fotoğraf URL"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="titleTr"
              value={newPhoto.titleTr}
              onChange={handleInputChange}
              placeholder="Başlık (Türkçe)"
              className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              name="titleEn"
              value={newPhoto.titleEn}
              onChange={handleInputChange}
              placeholder="Title (English)"
              className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              name="descriptionTr"
              value={newPhoto.descriptionTr}
              onChange={handleInputChange}
              placeholder="Açıklama (Türkçe)"
              className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              rows={3}
            />
            <textarea
              name="descriptionEn"
              value={newPhoto.descriptionEn}
              onChange={handleInputChange}
              placeholder="Description (English)"
              className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              rows={3}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Etiketler</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {labels.map((label) => (
                <div key={label.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`label-${label.id}`}
                    checked={newPhoto.labelIds?.includes(Number(label.id)) || false}
                    onChange={() => handleLabelChange(Number(label.id))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`label-${label.id}`} className="ml-2 block text-sm text-gray-900">
                    {label.nameTr}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          >
            Ekle
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={photos}
            strategy={verticalListSortingStrategy}
          >
            {photos.map((photo) => (
              <SortableItem
                key={photo.id}
                photo={photo}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {isEditModalOpen && editingPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Fotoğraf Düzenle</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  name="imageUrl"
                  value={editingPhoto.imageUrl}
                  onChange={handleEditInputChange}
                  placeholder="Fotoğraf URL"
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="titleTr"
                    value={editingPhoto.titleTr}
                    onChange={handleEditInputChange}
                    placeholder="Başlık (Türkçe)"
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    name="titleEn"
                    value={editingPhoto.titleEn}
                    onChange={handleEditInputChange}
                    placeholder="Title (English)"
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <textarea
                    name="descriptionTr"
                    value={editingPhoto.descriptionTr}
                    onChange={handleEditInputChange}
                    placeholder="Açıklama (Türkçe)"
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    rows={3}
                  />
                  <textarea
                    name="descriptionEn"
                    value={editingPhoto.descriptionEn}
                    onChange={handleEditInputChange}
                    placeholder="Description (English)"
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    rows={3}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Etiketler</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {labels.map((label) => (
                    <div key={label.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`edit-label-${label.id}`}
                        checked={selectedLabelIds.includes(Number(label.id))}
                        onChange={() => handleEditLabelChange(Number(label.id))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`edit-label-${label.id}`} className="ml-2 block text-sm text-gray-900">
                        {label.nameTr}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
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

export default PhotoContent;
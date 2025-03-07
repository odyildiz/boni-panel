import { useState, useEffect } from 'react';
import { usePhotoService, GalleryPhotoDto, AddPhotoRequest, UpdatePhotoRequest, PhotoLabelDto } from '../services/photoService';
import { usePhotoLabelService } from '../services/photoLabelService';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useReorderService } from '../services/reorderService';

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
    <div ref={setNodeRef} style={style} className="bg-white rounded shadow overflow-hidden w-full flex flex-col md:flex-row mb-4">
      <div className="flex md:hidden items-center px-2 py-2 border-b border-gray-100">
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
      <div className="flex">
        <div className="hidden md:flex items-center px-2">
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
        <div className="w-full md:w-40 h-40 md:h-full">
          <img
            src={photo.imageUrl}
            alt={photo.titleTr}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-gray-700 text-lg mb-1">{photo.titleTr}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{photo.descriptionTr}</p>
          {photo.labels && photo.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1 mb-3">
              {photo.labels.map(label => (
                <span key={label.id} className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {label.nameTr}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-auto">
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
            <MultiSelect
              options={labels}
              selected={newPhoto.labelIds || []}
              onChange={(selected) => setNewPhoto(prev => ({ ...prev, labelIds: selected }))}
              placeholder="Etiket seçiniz"
            />
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
                <MultiSelect
                  options={labels}
                  selected={selectedLabelIds}
                  onChange={setSelectedLabelIds}
                  placeholder="Etiket seçiniz"
                />
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

// Add this new MultiSelect component at the bottom of the file
const MultiSelect = ({ 
  options, 
  selected, 
  onChange,
  placeholder = 'Select labels'
}: {
  options: PhotoLabelDto[],
  selected: number[],
  onChange: (selected: number[]) => void,
  placeholder?: string
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (labelId: number) => {
    const newSelected = selected.includes(labelId)
      ? selected.filter(id => id !== labelId)
      : [...selected, labelId];
    onChange(newSelected);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-left flex items-center justify-between"
      >
        <span className="truncate">
          {selected.length > 0 
            ? options.filter(opt => selected.includes(Number(opt.id))).map(opt => opt.nameTr).join(', ')
            : placeholder}
        </span>
        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
          {options.map((label) => (
            <label
              key={label.id}
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(Number(label.id))}
                onChange={() => toggleOption(Number(label.id))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">{label.nameTr}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoContent;
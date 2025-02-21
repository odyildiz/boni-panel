import { useState, useEffect } from 'react';
import { usePhotoService, GalleryPhotoDto, AddPhotoRequest, UpdatePhotoRequest } from '../services/photoService';

const GalleryContent = () => {
  const [photos, setPhotos] = useState<GalleryPhotoDto[]>([]);
  const [newPhoto, setNewPhoto] = useState<AddPhotoRequest>({
    imageUrl: '',
    titleTr: '',
    titleEn: '',
    descriptionTr: '',
    descriptionEn: ''
  });
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhotoDto | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const photoService = usePhotoService();

  useEffect(() => {
    loadPhotos();
  }, []);

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
      descriptionEn: ''
    });
    loadPhotos();
  };

  const handleEdit = (photo: GalleryPhotoDto) => {
    setEditingPhoto(photo);
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
      descriptionEn: editingPhoto.descriptionEn
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

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu fotoğrafı silmek istediğinizden emin misiniz?')) {
      await photoService.remove(id);
      loadPhotos();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Galeri İçeriği</h1>

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
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          >
            Ekle
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-white rounded shadow overflow-hidden w-full flex">
            <div className="w-2/5">
              <img
                src={photo.imageUrl}
                alt={photo.titleTr}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-3/5 p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-700 text-xl mb-2">{photo.titleTr}</h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-700">{photo.descriptionTr}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(photo)}
                  className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                >
                  Kaldır
                </button>
              </div>
            </div>
          </div>
        ))}
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

export default GalleryContent;
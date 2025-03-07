import { useState, useEffect } from 'react';
import { usePhotoLabelService, PhotoLabelDto, AddPhotoLabelRequest, UpdatePhotoLabelRequest } from '../services/photoLabelService';

const PhotoLabelContent = () => {
  const [labels, setLabels] = useState<PhotoLabelDto[]>([]);
  const [newLabel, setNewLabel] = useState<AddPhotoLabelRequest>({
    nameTr: '',
    nameEn: ''
  });
  const [editingLabel, setEditingLabel] = useState<PhotoLabelDto | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const photoLabelService = usePhotoLabelService();

  useEffect(() => {
    loadLabels();
  }, []);

  const loadLabels = async () => {
    const allLabels = await photoLabelService.getAll();
    setLabels(allLabels);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLabel(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingLabel) {
      setEditingLabel(prev => ({
        ...prev!,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.nameTr.trim() || !newLabel.nameEn.trim()) return;

    await photoLabelService.create(newLabel);
    setNewLabel({
      nameTr: '',
      nameEn: ''
    });
    loadLabels();
  };

  const handleEdit = (label: PhotoLabelDto) => {
    setEditingLabel(label);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLabel || !editingLabel.nameTr.trim() || !editingLabel.nameEn.trim()) return;

    const updateRequest: UpdatePhotoLabelRequest = {
      nameTr: editingLabel.nameTr,
      nameEn: editingLabel.nameEn
    };

    await photoLabelService.update(editingLabel.id, updateRequest);
    setEditingLabel(null);
    setIsEditModalOpen(false);
    loadLabels();
  };

  const handleEditCancel = () => {
    setEditingLabel(null);
    setIsEditModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu etiketi silmek istediğinizden emin misiniz?')) {
      await photoLabelService.remove(id);
      loadLabels();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Fotoğraf Etiketleri</h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="nameTr"
              value={newLabel.nameTr}
              onChange={handleInputChange}
              placeholder="Etiket Adı (Türkçe)"
              className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              name="nameEn"
              value={newLabel.nameEn}
              onChange={handleInputChange}
              placeholder="Label Name (English)"
              className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
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
        {labels.map((label) => (
          <div key={label.id} className="bg-white rounded shadow overflow-hidden w-full flex p-4">
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Türkçe:</span>
                  <h3 className="font-bold text-gray-700">{label.nameTr}</h3>
                </div>
                <div>
                  <span className="text-sm text-gray-500">English:</span>
                  <h3 className="font-bold text-gray-700">{label.nameEn}</h3>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(label)}
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none"
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(label.id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
              >
                Kaldır
              </button>
            </div>
          </div>
        ))}
      </div>

      {isEditModalOpen && editingLabel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Etiket Düzenle</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="nameTr"
                    value={editingLabel.nameTr}
                    onChange={handleEditInputChange}
                    placeholder="Etiket Adı (Türkçe)"
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    name="nameEn"
                    value={editingLabel.nameEn}
                    onChange={handleEditInputChange}
                    placeholder="Label Name (English)"
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
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

export default PhotoLabelContent;
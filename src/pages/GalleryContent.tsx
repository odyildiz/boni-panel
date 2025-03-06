import { useState, useEffect } from 'react';
import { usePhotoService, GalleryPhotoDto, AddPhotoRequest, UpdatePhotoRequest } from '../services/photoService';
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

const GalleryContent = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Galeri İçeriği</h1>
      
      <div className="flex flex-col md:flex-row justify-center items-center gap-6">
        <Link 
          to="/photo-content" 
          className="w-full md:w-64 py-4 px-6 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 flex items-center justify-center"
        >
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Fotoğraf İçeriği
        </Link>
        <Link 
          to="/photo-label-content" 
          className="w-full md:w-64 py-4 px-6 bg-green-600 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200 flex items-center justify-center"
        >
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Fotoğraf Etiketleri
        </Link>
      </div>
    </div>
  );
};

export default GalleryContent;
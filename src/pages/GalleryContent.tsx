import { Link } from 'react-router-dom';

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
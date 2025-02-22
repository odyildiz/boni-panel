import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useApi } from '../hooks/useApi';

const Home = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const api = useApi();

  const handleRedeploy = async () => {
    try {
      setIsDeploying(true);
      await api.get('/redeploy/boni-ui');
      alert('Değişiklikler başarıyla yansıtıldı!');
    } catch (error) {
      alert('Değişiklikler yansıtılırken bir hata oluştu.');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-8">
      <h1 className="text-3xl font-bold text-center mb-8">Boni İçerik Yönetim Paneli</h1>
      <div className="grid md:grid-cols-2 gap-6 px-4 mb-8">
        <Link
          to="/menu-content"
          className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <h2 className="text-blue-600 text-2xl font-semibold mb-3">Menü İçeriği</h2>
          <p className="text-gray-600">Menü kategorilerini ve öğelerini yönetin</p>
        </Link>
        <Link
          to="/gallery-content"
          className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <h2 className="text-blue-600 text-2xl font-semibold mb-3">Galeri İçeriği</h2>
          <p className="text-gray-600">Galeri içeriklerini yönetin</p>
        </Link>
      </div>
      <div className="px-4">
        <button
          onClick={handleRedeploy}
          disabled={isDeploying}
          className="w-full p-4 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors"
        >
          {isDeploying ? 'Değişiklikler Yansıtılıyor...' : 'Değişiklikleri Yansıt'}
        </button>
      </div>
    </div>
  );
};

export default Home;
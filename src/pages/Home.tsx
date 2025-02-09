import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="w-full max-w-4xl mx-auto pt-8">
      <h1 className="text-3xl font-bold text-center mb-8">Boni İçerik Yönetim Paneli</h1>
      <div className="grid md:grid-cols-2 gap-6 px-4">
        <Link
          to="/menu-content"
          className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <h2 className="text-blue-600 text-2xl font-semibold mb-3">Menü İçeriği</h2>
          <p className="text-gray-600">Menü kategorilerini ve öğelerini yönetin</p>
        </Link>
        <Link
          to="/general-content"
          className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <h2 className="text-blue-600 text-2xl font-semibold mb-3">Genel İçerikler</h2>
          <p className="text-gray-600">Genel site içeriklerini yönetin</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
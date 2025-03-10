import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import boniLogo from '../../boni-logo.jpg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <img src={boniLogo} alt="Boni Logo" className="h-8 w-8 rounded-full object-cover" />
            <h2 className="text-white font-semibold hover:text-gray-300">Boni İçerik Yönetim Paneli</h2>
          </Link>
          <div className="hidden md:block">
          {isAuthenticated && (
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/menu-content"
                className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Menü İçeriği
              </Link>
              <Link
                to="/gallery-content"
                className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Galeri İçeriği
              </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Çıkış Yap
                </button>
            </div>
          )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleNavbar}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
      {isAuthenticated && (
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/menu-content"
            className="text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Menü İçeriği
          </Link>
          <Link
            to="/gallery-content"
            className="text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Galeri İçeriği
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium" >
            Çıkış Yap
          </button>
        </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
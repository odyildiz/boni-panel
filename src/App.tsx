import './App.css'

import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MenuContent from './pages/MenuContent';
import GalleryContent from './pages/GalleryContent';
import PhotoContent from './pages/PhotoContent';
import PhotoLabelContent from './pages/PhotoLabelContent';
import MenuItems from './pages/MenuItems';
import Home from './pages/Home';
import { Login } from './pages/Login';
import { Logout } from './pages/Logout';
import { PrivateRoute } from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex items-center justify-center mt-16">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/menu-content" element={<PrivateRoute><MenuContent /></PrivateRoute>} />
              <Route path="/gallery-content" element={<PrivateRoute><GalleryContent /></PrivateRoute>} />
              <Route path="/photo-content" element={<PrivateRoute><PhotoContent /></PrivateRoute>} />
              <Route path="/photo-label-content" element={<PrivateRoute><PhotoLabelContent /></PrivateRoute>} />
              <Route path="/menu-items/:categoryId" element={<PrivateRoute><MenuItems /></PrivateRoute>} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

import './App.css'

import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MenuContent from './pages/MenuContent';
import GeneralContent from './pages/GeneralContent';
import MenuItems from './pages/MenuItems';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex items-center justify-center mt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu-content" element={<MenuContent />} />
            <Route path="/general-content" element={<GeneralContent />} />
            <Route path="/menu-items/:categoryId" element={<MenuItems />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Map from './pages/Map/Map';
import Contact from './pages/Contact/Contact';
import Tips from './pages/Tips/Tips';

// 라우트를 담당하는 컴포넌트를 분리
const AppRoutes: React.FC = () => {
  const location = useLocation();
  
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Map />} />
      <Route path="/tips" element={<Tips />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <main style={{ 
        width: '100vw', 
        height: '100vh',
        paddingTop: 'var(--navbar-height)',
      }}>
        <AppRoutes />
      </main>
    </Router>
  );
};

export default App;
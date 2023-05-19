import './App.css';

import Officetel from './pages/Officetel';
import Home from './pages/Home';
import { Routes, Route } from "react-router-dom";


function App() {
  return (
    <div>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/officetel" element={<Officetel />} />
        </Routes>
      
    </div>
  );
}

export default App;

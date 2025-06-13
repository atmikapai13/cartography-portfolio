import React, { useState } from 'react';
import MapboxGlobe from './components/MapboxGlobe';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-title">Atmika Pai</div>
        <ul className="nav-links">
          <li><a href="#work">Work</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#writings">Writings</a></li>
          <li><a href="#atlas" className="dropdown">Atlas</a>
            <ul className="dropdown-content">
              <li><a href="#vacations">Vacations</a></li>
              <li><a href="#movies">Movies</a></li>
            </ul>
          </li>
        </ul>
      </nav>
      {/* Main content: Map and Sidebar */}
      <div className="main-content">
        <div className="map-wrapper">
          <MapboxGlobe onCitySelect={setSelectedCity} />
        </div>
        <Sidebar selectedCity={selectedCity} onClearCity={() => setSelectedCity(null)} />
      </div>
      {/* Footer */}
      <footer className="footer">
        <span>Built with Cursor + Vite + React.js + Mapbox GL JS</span>
      </footer>
    </div>
  );
}

export default App;

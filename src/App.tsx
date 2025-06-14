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
        <div className="nav-title">ATMIKA PAI</div>
      </nav>
      {/* Main content: Map and Sidebar */}
      <div className="main-content">
        <div className="map-wrapper">
          <MapboxGlobe onCitySelect={setSelectedCity} />
        </div>
        <Sidebar selectedCity={selectedCity} onClearCity={() => setSelectedCity(null)} />
      </div>
      {/* Moved nav-links below the map/sidebar */}
      
      {/* Footer */}
      <footer className="footer" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 36, padding: '2px 0 2px 40px', background: 'rgba(0,0,0,0.04)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Envelope SVG */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f5f5e6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle' }}><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>
          <span style={{fontSize: '1em', color: '#f5f5e6' }}>atmikapai13@gmail.com</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Duck SVG */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#f5f5e6" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline', verticalAlign: 'middle' }}><path d="M20.5 13c.83 0 1.5-.67 1.5-1.5S21.33 10 20.5 10c-.28 0-.54.07-.77.19C19.4 7.61 17.03 6 14.5 6c-2.76 0-5 2.24-5 5 0 .34.03.67.08 1H7c-1.1 0-2 .9-2 2s.9 2 2 2h1v1c0 1.1.9 2 2 2h6c2.21 0 4-1.79 4-4v-1h.5z"/></svg>
          <span style={{ fontSize: '1em', color: '#f5f5e6'}}>@atmikapai13</span>
        </span>
      </footer>
      </div>
  );
}

export default App;

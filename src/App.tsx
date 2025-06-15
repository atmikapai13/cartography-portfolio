import { useState } from 'react';
import MapboxGlobe from './components/MapboxGlobe';
import Sidebar from './components/Sidebar';
import './App.css';

function isMobileOrTablet() {
  if (typeof navigator === 'undefined') return false;
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Tablet|Mobile/i.test(navigator.userAgent);
}

function App() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  if (isMobileOrTablet()) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#181818', color: '#f5f5e6', fontSize: '1.3rem', textAlign: 'center', padding: 32, fontStyle: 'italic', flexDirection: 'column' }}>
        <span style={{ fontSize: '3rem', marginBottom: '1.2rem' }}>🌎</span>
        For the best experience, please view this website on a desktop.
      </div>
    );
  }

  return (
      <div>
      {/* Navigation Bar */}
      <nav className="navbar" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        {/* Header */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div className="nav-title" style={{ fontSize: '1.0rem', fontWeight: 1000, color: '#f8f6f0', fontFamily: 'Arial', fontStyle: 'normal', letterSpacing: '0.2rem', marginTop: '10px' }}>
            ATMIKA PAI
          </div>
        </div>
      </nav>
      {/* Main content: Map and Sidebar */}
      <div className="main-content">
        <div className="map-wrapper">
          <MapboxGlobe onCitySelect={setSelectedCity} />
        </div>
        <Sidebar selectedCity={selectedCity} />
      </div>
      {/* Moved nav-links below the map/sidebar */}
      
      {/* Footer */}
      <footer className="footer" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.04)', padding: '2px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 25 }}>
          <a href="https://www.linkedin.com/in/atmikapai/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{ verticalAlign: 'middle' }}>
              <rect width="24" height="24" rx="4" fill="#181818"/>
              <path d="M6.94 19V9.5H4V19h2.94zM5.47 8.27a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42zM20 19h-2.93v-4.7c0-1.12-.02-2.56-1.56-2.56-1.56 0-1.8 1.22-1.8 2.48V19H10V9.5h2.82v1.3h.04c.39-.74 1.34-1.52 2.76-1.52 2.95 0 3.5 1.94 3.5 4.47V19z" fill="#fff"/>
            </svg>
          </a>
          <a href="https://medium.com/@atmikapai" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1043.63 592.71" fill="#f5f5e6" style={{ verticalAlign: 'middle' }}><g><path d="M588.67 296.14c0 163.51-131.29 296.13-293.33 296.13S2 459.65 2 296.14 133.29 0 295.33 0s293.34 132.63 293.34 296.14z"/><ellipse cx="873.5" cy="296.14" rx="170.13" ry="282.24"/><path d="M1041.63 296.14c0 155.94-76.13 282.24-170.13 282.24s-170.13-126.3-170.13-282.24S777.5 13.9 871.5 13.9s170.13 126.3 170.13 282.24z"/></g></svg>
          </a>
          <a href="mailto:atmikapai13@gmail.com" style={{fontSize: '1em', color: '#f5f5e6', textDecoration: 'none', display: 'flex', alignItems: 'center', marginTop: '10px'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f5f5e6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle' }}><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>
          </a>
          <a href="/cartography-portfolio/assets/AtmikaPai_Resume.pdf" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', marginTop: '10px'}} title="View Resume">
            <svg width="17" height="15" viewBox="0 0 24 24" fill="none" stroke="#f5f5e6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><polyline points="8,6 16,6"/><polyline points="8,10 16,10"/><polyline points="8,14 12,14"/></svg>
          </a>
        </div>
      </footer>
      </div>
  );
}

export default App;

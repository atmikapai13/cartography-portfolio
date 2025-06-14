import { useState } from 'react';
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
      <footer className="footer" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 36, padding: '2px 0 2px 40px', background: 'rgba(0,0,0,0.04)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
           <a href="https://www.linkedin.com/in/atmikapai/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{ verticalAlign: 'middle' }}>
               <rect width="24" height="24" rx="4" fill="#181818"/>
               <path d="M6.94 19V9.5H4V19h2.94zM5.47 8.27a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42zM20 19h-2.93v-4.7c0-1.12-.02-2.56-1.56-2.56-1.56 0-1.8 1.22-1.8 2.48V19H10V9.5h2.82v1.3h.04c.39-.74 1.34-1.52 2.76-1.52 2.95 0 3.5 1.94 3.5 4.47V19z" fill="#fff"/>
             </svg>
           </a>
           <a href="https://medium.com/@atmikapai" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1043.63 592.71" fill="#f5f5e6" style={{ verticalAlign: 'middle' }}><g><path d="M588.67 296.14c0 163.51-131.29 296.13-293.33 296.13S2 459.65 2 296.14 133.29 0 295.33 0s293.34 132.63 293.34 296.14z"/><ellipse cx="873.5" cy="296.14" rx="170.13" ry="282.24"/><path d="M1041.63 296.14c0 155.94-76.13 282.24-170.13 282.24s-170.13-126.3-170.13-282.24S777.5 13.9 871.5 13.9s170.13 126.3 170.13 282.24z"/></g></svg>
           </a>
           <a href="mailto:atmikapai13@gmail.com" style={{fontSize: '1em', color: '#f5f5e6', textDecoration: 'none', display: 'flex', alignItems: 'center'}}>
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f5f5e6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle' }}><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>
           </a>
        </span>
      </footer>
      </div>
  );
}

export default App;

import MapboxGlobe from './components/MapboxGlobe';
import './App.css';

function App() {
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
      {/* Map section fits between header and footer */}
      <div className="map-wrapper">
        <MapboxGlobe />
      </div>
      <div className="overlay">
        <h3>Projects Around the World</h3>
        <p>Interactive globe showing my project locations</p>
      </div>
      {/* Footer */}
      <footer className="footer">
        <span>Built with Vite + React.js + Mapbox GL JS</span>
      </footer>
    </div>
  );
}

export default App;


import './Ticker.css';

interface City {
  name: string;
  longitude: number;
  latitude: number;
}

interface TickerProps {
  items: City[];
  map: mapboxgl.Map | null;
  onCityClick: () => void;
  onCitySelect?: (city: string | null) => void;
  onCreatePopup?: (cityName: string, lngLat: [number, number]) => void;
}

const Ticker = ({ items, map, onCityClick, onCitySelect, onCreatePopup }: TickerProps) => {
  const tickerItems = [...items, ...items];

  const handleCityClick = (city: City) => {
    if (map) {
      if (onCitySelect) {
        onCitySelect(city.name);
      }
      onCityClick();
      map.flyTo({
        center: [city.longitude, city.latitude],
        zoom: 10,
        speed: 3.5,
        curve: 1.42,
        easing(t) {
          return t;
        }
      });
      
      // Create popup after flying to the location
      if (onCreatePopup) {
        setTimeout(() => {
          onCreatePopup(city.name, [city.longitude, city.latitude]);
        }, 1000); // Wait for the fly animation to complete
      }
    }
  };

  return (
    <div className="ticker-container">
      <div className="ticker-content">
        {tickerItems.map((item, index) => (
          <span 
            key={index} 
            onClick={() => handleCityClick(item)}
            style={{ cursor: 'pointer' }}
          >
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Ticker; 
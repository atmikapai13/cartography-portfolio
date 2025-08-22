import './Ticker.css';

export interface City {
  name: string;
  longitude: number;
  latitude: number;
}

interface TickerProps {
  items: City[];
  map: mapboxgl.Map | null;
  onCityClick: () => void;
  onCitySelect?: (city: string | null) => void;
  onCityPopup?: (city: City) => void;
}

const Ticker = ({ items, map, onCityClick, onCitySelect, onCityPopup }: TickerProps) => {
  const tickerCityOrder = ['New York', 'Berkeley', 'San Diego', 'Mumbai'];
  const filteredItems = tickerCityOrder
    .map(cityName => items.find(item => item.name === cityName))
    .filter(Boolean) as City[];

  const handleCityClick = (city: City) => {
    if (map) {
      if (onCitySelect) {
        onCitySelect(city.name);
      }
      onCityClick();
      map.flyTo({
        center: [city.longitude, city.latitude],
        zoom: 11,
        speed: 2.0,
        curve: 1.40,
        easing(t) {
          return t;
        }
      });
      if (onCityPopup) {
        onCityPopup(city);
      }
    }
  };

  return (
    <div className="ticker-container">
      <div className="ticker-content static-ticker">
        <span className="ticker-label">Cities:</span>
        {filteredItems.map((item, index) => (
          <span 
            key={index} 
            onClick={() => handleCityClick(item)}
            style={{ cursor: 'pointer' }}
          >
            {index + 1}. {item.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Ticker; 
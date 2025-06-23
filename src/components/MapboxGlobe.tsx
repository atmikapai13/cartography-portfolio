import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import projects from "../projects.json";
import placeData from '../places.json';
import Ticker from './Ticker';

// Project cities data
const project_cities = [
    { id: 1, name: "New York", country: "USA", longitude: -73.9712, latitude: 40.7831 }, 
    { id: 2, name: "Hawaii", country: "USA", longitude: -155.5828, latitude: 19.8968},
    { id: 3, name: "San Francisco", country: "USA", longitude: -122.4325, latitude: 37.7751 }, 
    { id: 4, name: "Mumbai", country: "India", longitude: 72.8679, latitude: 19.1144 },
    { id: 5, name: "San Diego", country: "USA", longitude: -117.1611, latitude: 32.7157 },
    { id: 6, name: "Palm Springs", country: "USA", longitude: -116.5453, latitude: 33.8303 },
    { id: 7, name: "Berkeley", country: "USA", longitude: -122.2549, latitude: 37.8676},
    { id: 26, name: "Cafenated, North Berkeley", country: "USA", longitude: -122.2725, latitude: 37.8759 },
    { id: 8, name: "Oakland", country: "USA", longitude: -122.27208, latitude: 37.80903 },
    { id: 9, name: "Sydney", country: "Australia", longitude: 151.15115, latitude: -33.75535},
    { id: 10, name: "Singapore", country: "Singapore", longitude: 103.88870, latitude: 1.31748 },
    { id: 11, name: "Yokohama", country: "Japan", longitude: 139.6380, latitude: 35.4437 },
    { id: 12, name: "West Hollywood", country: "USA", longitude: -118.3617, latitude: 34.0900 },
    { id: 13, name: "Walnut Creek", country: "USA", longitude: -122.0664, latitude: 37.9184 },
    { id: 14, name: "Arizona", country: "USA", longitude: -112.185986, latitude: 33.538652 },
    { id: 15, name: "Nevada", country: "USA", longitude: -116.4194, latitude: 38.8026 },
    { id: 16, name: "Utah", country: "USA", longitude: -111.0937, latitude: 39.32098 },
    { id: 17, name: "New Jersey", country: "USA", longitude: -74.4057, latitude: 40.0583 },
    { id: 18, name: "Roosevelt Island", country: "USA", longitude: -73.95630, latitude: 40.75581 },
    { id: 27, name: "Cafe Aviva, Roosevelt Island", country: "USA", longitude: -73.9478, latitude: 40.7605 },
    { id: 19, name: "Brooklyn (BK11)", country: "USA", borough: "Brooklyn", longitude: -73.9332, latitude: 40.6536 },
    { id: 20, name: "Brooklyn (BK17)", country: "USA", borough: "Brooklyn", longitude: -73.9225, latitude: 40.6496 },
    { id: 21, name: "Bronx (BX5)", country: "USA", borough: "Bronx", longitude: -73.9020, latitude: 40.8317 },
    { id: 22, name: "Manhattan (MN10)", country: "USA", borough: "Manhattan", longitude: -73.9465, latitude: 40.8116 },
    { id: 23, name: "Queens (QN2)", country: "USA", borough: "Queens", longitude: -73.9326, latitude: 40.7612 },
    { id: 24, name: "Lower Manhattan", country: "USA", longitude: -74.0090, latitude: 40.7075 },
    { id: 25, name: "Christchurch", country: "New Zealand", longitude: 172.6306, latitude: -43.5321 },
    { id: 28, name: "London", country: "USA", longitude: 0.1281, latitude: 51.5080 },
  ];

const zoomGatedCities = ["Walnut Creek", "Roosevelt Island", "New Jersey", "Oakland", "Berkeley", "West Hollywood",
  "Brooklyn (BK11)", "Brooklyn (BK17)", "Bronx (BX5)", "Manhattan (MN10)", "Queens (QN2)", 
  "Lower Manhattan", "Christchurch", "Cafenated, North Berkeley", "Cafe Aviva, Roosevelt Island", "London"
];

mapboxgl.accessToken = "pk.eyJ1IjoiYXRtaWthcGFpMTMiLCJhIjoiY21idHR4eTJpMDdhMjJsb20zNmZheTZ6ayJ9.d_bQSBzesyiCUMA-YHRoIA";

interface MapboxGlobeProps {
  selectedCity: string | null;
  onCitySelect?: (city: string | null) => void;
  showDisclaimer: boolean;
}

export default function MapboxGlobe({ selectedCity, onCitySelect, showDisclaimer }: MapboxGlobeProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const activePopup = useRef<mapboxgl.Popup | null>(null);
  const rotationEnabled = useRef(true);

  const tickerCities = project_cities
    .filter(city => !zoomGatedCities.includes(city.name));

  const handleTickerClick = () => {
    rotationEnabled.current = false;
  };

  const createCityPopup = (cityName: string, lngLat: [number, number]) => {
    const isMobile = window.innerWidth <= 600;
    if (isMobile) return;

    if (!mapRef.current) return;

    if (activePopup.current) {
      activePopup.current.remove();
      activePopup.current = null;
    }

    // Find city info (place_description and date)
    const cityData = (placeData as any[]).find(
      (entry) => entry.city.trim().toLowerCase() === cityName.trim().toLowerCase()
    );

    let popupContent = `<div class="city-popup" style="text-align:center;">`;
    if (!cityData) {
      popupContent += ``;
    } else {
      popupContent += `<div class="city-description">`;
      popupContent += `<h3 style='margin-bottom: 6px; text-align:center;'>${cityName}</h3>`;
      if (cityData.image) {
        popupContent += `<img src='${cityData.image}' alt='${cityName}' style='display:block;margin:0 auto 10px auto;max-width:250px; width:100%;height:auto;border-radius:10px;' />`;
      }
      popupContent += `<div style='font-size:0.98rem;color:#bdbdbd;margin-bottom:8px;text-align:center;'><em>${cityData.date || ''}</em></div>`;
      popupContent += `<div style='font-size:1.05rem;color:#e0e0e0;text-align:center;'>${cityData.place_description || ''}</div>`;
      popupContent += `</div>`;
    }
    popupContent += `</div>`;

    // Pause rotation when popup opens
    rotationEnabled.current = false;
    
    const popup = new mapboxgl.Popup({ maxWidth: '450px' })
      .setLngLat(lngLat)
      .setHTML(popupContent)
      .addTo(mapRef.current);

    activePopup.current = popup;
    
    // Resume rotation when popup closes
    popup.on('close', () => {
      rotationEnabled.current = true;
      if (onCitySelect) onCitySelect(null);
      activePopup.current = null;
    });
  };

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (selectedCity === null) {
      // If city selection is cleared, remove the active popup but don't change the view.
      if (activePopup.current) {
        activePopup.current.remove();
        activePopup.current = null;
      }
      rotationEnabled.current = true;
    }
  }, [selectedCity]);

  useEffect(() => {
    if (!mapContainer.current) return;

    const isMobile = window.innerWidth <= 600;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v11", //satellite-v9
      projection: "globe",
      center: [-110, 25],
      zoom: isMobile ? 0.40 : 1.60,
      bearing: 0,
      pitch: 0,
      minZoom: isMobile ? 0.40 : 1.60,
      attributionControl: false,
    });
    mapRef.current = map;


    map.on("style.load", () => {
      console.log("Loaded projects:", projects);
      map.setFog({
        color: "rgb(234, 242, 250)",
        "high-color": "rgb(9, 139, 226)",
        "horizon-blend": 0.1,
        "space-color": "rgba(2, 39, 54, 0.79)",
        "star-intensity": 1.0,
      });

      // --- Add city markers ---
      const cityFeatures = project_cities.map((city) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [city.longitude, city.latitude],
        },
        properties: {
          id: city.id,
          name: city.name,
          country: city.country,
        },
      }));

      map.addSource("cities", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: cityFeatures,
        },
      });

      map.addLayer({
        id: "city-markers",
        type: "circle",
        source: "cities",
        paint: {
          "circle-radius": [
            "case",
            ["in", ["get", "name"], ["literal", zoomGatedCities]], 4,
            5
          ],
          "circle-color": [
            "case",
            ["in", ["get", "name"], ["literal", zoomGatedCities]], "#ed462b",
            "#ed462b"
          ],
          "circle-stroke-width": 1,
          "circle-stroke-color": "#000000",
          "circle-opacity": 1.0,
        },
        filter: [
          "any",
          ["all", ...zoomGatedCities.map(city => ["!=", ["get", "name"], city])],
          ...zoomGatedCities.map(city => [
            "all",
            ["==", ["get", "name"], city],
            [">=", ["zoom"], 3]
          ])
        ]
      });

      map.addLayer({
        id: "city-labels",
        type: "symbol",
        source: "cities",
        layout: {
          "text-field": ["get", "name"],
          "text-size": 12,
          "text-offset": [0, 1.2],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#fff",
        },
      });

      // Popup on marker click
      map.on("click", "city-markers", (e) => {
        const cityName = e.features?.[0]?.properties?.name;
        if (!cityName) return;
        if (onCitySelect) onCitySelect(cityName);

        createCityPopup(cityName, [e.lngLat.lng, e.lngLat.lat]);
      });

      // Clear city selection when clicking on map background
      map.on("click", (e) => {
        // Only clear if not clicking on a city marker
        const features = map.queryRenderedFeatures(e.point, { layers: ['city-markers'] });
        if (features.length === 0 && onCitySelect) {
          onCitySelect(null);
        }
      });

      map.on("mouseenter", "city-markers", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "city-markers", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    // Globe rotation
    let isUserInteracting = false;
    const ZOOM_THRESHOLD = 2.5; // Stop rotation when zoomed in beyond this level

    function rotateGlobe() {
      const currentZoom = map.getZoom();
      if (rotationEnabled.current && !isUserInteracting && currentZoom < ZOOM_THRESHOLD) {
        const center = map.getCenter();
        const newLng = ((center.lng + 0.1) + 360) % 360;
        map.setCenter([newLng, center.lat]);
      }
      setTimeout(rotateGlobe, 16.7);
    }

    // Add zoom change listener
    map.on('zoom', () => {
      const currentZoom = map.getZoom();
      if (currentZoom >= ZOOM_THRESHOLD) {
        rotationEnabled.current = false;
      }
    });

    map.on("mousedown", () => { isUserInteracting = true; rotationEnabled.current = false; });
    map.on("touchstart", () => { isUserInteracting = true; rotationEnabled.current = false; });
    map.on("mouseup", () => { 
      isUserInteracting = false; 
      rotationEnabled.current = map.getZoom() < ZOOM_THRESHOLD;
    });
    map.on("touchend", () => { 
      isUserInteracting = false; 
      rotationEnabled.current = map.getZoom() < ZOOM_THRESHOLD;
    });
    map.on("load", rotateGlobe);

    return () => map.remove();
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        ref={mapContainer}
        style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
      />
      {!showDisclaimer && <Ticker items={tickerCities} map={mapRef.current} onCityClick={handleTickerClick} onCitySelect={onCitySelect} onCreatePopup={createCityPopup} />}
    </div>
  );
} 
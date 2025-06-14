import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import projects from "../projects.json";
import placeData from '../places.json';

// Project cities data
const project_cities = [
    { id: 1, name: "New York", country: "USA", longitude: -73.95483256602007, latitude: 40.7558514702378 }, 
    { id: 2, name: "Hawaii", country: "USA", longitude: -155.5828, latitude: 19.8968},
    { id: 3, name: "San Francisco", country: "USA", longitude: -122.4471, latitude: 37.7739 }, 
    { id: 4, name: "Mumbai", country: "India", longitude: 72.8679, latitude: 19.1144 },
    { id: 5, name: "San Diego", country: "USA", longitude: -117.1611, latitude: 32.7157 },
    { id: 6, name: "Palm Springs", country: "USA", longitude: -116.5453, latitude: 33.8303 },
    { id: 7, name: "Berkeley", country: "USA", longitude: -122.2568, latitude: 37.8676},
    { id: 8, name: "Oakland", country: "USA", longitude: -122.2695, latitude: 37.8038 },
    { id: 9, name: "Sydney", country: "Australia", longitude: 151.15115, latitude: -33.75535},
    { id: 10, name: "Singapore", country: "Singapore", longitude: 103.88870, latitude: 1.31748 },
    { id: 11, name: "Yokohama", country: "Japan", longitude: 139.6380, latitude: 35.4437 },
    { id: 12, name: "West Hollywood", country: "USA", longitude: -118.3617, latitude: 34.0900 },
    { id: 13, name: "Walnut Creek", country: "USA", longitude: -122.05825, latitude: 37.93023 },
    { id: 14, name: "Arizona", country: "USA", longitude: -112.185986, latitude: 33.538652 },
    { id: 15, name: "Nevada", country: "USA", longitude: -116.4194, latitude: 38.8026 },
    { id: 16, name: "Utah", country: "USA", longitude: -111.0937, latitude: 39.32098 },
  ];

mapboxgl.accessToken = "pk.eyJ1IjoiYXRtaWthcGFpMTMiLCJhIjoiY21idHR4eTJpMDdhMjJsb20zNmZheTZ6ayJ9.d_bQSBzesyiCUMA-YHRoIA";

interface MapboxGlobeProps {
  selectedProject?: any;
  onCitySelect?: (city: string | null) => void;
}

export default function MapboxGlobe({ selectedProject, onCitySelect }: MapboxGlobeProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v11", //satellite-v9
      projection: "globe",
      center: [-90, 0],
      zoom: 1.5,
      bearing: 0,
      pitch: 0,
      minZoom: 1.8,
    });
    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl());

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
          "circle-radius": 5,
          "circle-color": "#ed462b",
          "circle-stroke-width": 1,
          "circle-stroke-color": "#000000",
          "circle-opacity": 1.0,
        },
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

        // Find city info (place_description and date)
        const cityData = (placeData as any[]).find(
          (entry) => entry.city.trim().toLowerCase() === cityName.trim().toLowerCase()
        );

        let popupContent = `<div class="city-popup" style="text-align:center;">`;
        if (!cityData) {
          popupContent += `<p>No projects for this city.</p>`;
        } else {
          popupContent += `<div class="city-description">`;
          popupContent += `<h3 style='margin-bottom: 6px; text-align:center;'>${cityName}</h3>`;
          popupContent += `<div style='font-size:0.98rem;color:#bdbdbd;margin-bottom:8px;text-align:center;'><em>${cityData.date || ''}</em></div>`;
          popupContent += `<div style='font-size:1.05rem;color:#e0e0e0;text-align:center;'>${cityData.place_description || ''}</div>`;
          popupContent += `</div>`;
        }
        popupContent += `</div>`;

        // Pause rotation when popup opens
        rotationEnabled = false;
        const popup = new mapboxgl.Popup({ maxWidth: '420px' })
          .setLngLat(e.lngLat)
          .setHTML(popupContent)
          .addTo(map);
        // Resume rotation when popup closes
        popup.on('close', () => {
          rotationEnabled = true;
          if (onCitySelect) onCitySelect(null);
        });
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
    let rotationEnabled = true;
    const ZOOM_THRESHOLD = 2.5; // Stop rotation when zoomed in beyond this level

    function rotateGlobe() {
      const currentZoom = map.getZoom();
      if (rotationEnabled && !isUserInteracting && currentZoom < ZOOM_THRESHOLD) {
        const center = map.getCenter();
        const newLng = ((center.lng - 0.1) + 360) % 360;
        map.setCenter([newLng, center.lat]);
      }
      setTimeout(rotateGlobe, 16.7);
    }

    // Add zoom change listener
    map.on('zoom', () => {
      const currentZoom = map.getZoom();
      if (currentZoom >= ZOOM_THRESHOLD) {
        rotationEnabled = false;
      } else if (!isUserInteracting) {
        rotationEnabled = true;
      }
    });

    map.on("mousedown", () => { isUserInteracting = true; rotationEnabled = false; });
    map.on("touchstart", () => { isUserInteracting = true; rotationEnabled = false; });
    map.on("mouseup", () => { 
      isUserInteracting = false; 
      rotationEnabled = map.getZoom() < ZOOM_THRESHOLD;
    });
    map.on("touchend", () => { 
      isUserInteracting = false; 
      rotationEnabled = map.getZoom() < ZOOM_THRESHOLD;
    });
    map.on("load", rotateGlobe);

    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
    />
  );
} 
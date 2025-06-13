import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import projects from "../projects.json";

// Project cities data
const project_cities = [
    { id: 1, name: "New York", country: "USA", longitude: -74.006, latitude: 40.7128 },
    { id: 2, name: "Hawaii", country: "USA", longitude: -155.5828, latitude: 19.8968 },
    { id: 3, name: "San Francisco", country: "USA", longitude: -122.4194, latitude: 37.7749 },
    { id: 4, name: "Mumbai", country: "India", longitude: 72.8777, latitude: 19.0760 },
    { id: 5, name: "San Diego", country: "USA", longitude: -117.1611, latitude: 32.7157 },
    { id: 6, name: "Palm Springs", country: "USA", longitude: -116.5453, latitude: 33.8303 },
    { id: 7, name: "Berkeley", country: "USA", longitude: -122.2727, latitude: 37.8715 },
    { id: 9, name: "Sydney", country: "Australia", longitude: 151.2093, latitude: -33.8688 },
    { id: 10, name: "Singapore", country: "Singapore", longitude: 103.8198, latitude: 1.3521 },
    { id: 11, name: "Yokohama", country: "Japan", longitude: 139.6380, latitude: 35.4437 },
  ];

mapboxgl.accessToken = "pk.eyJ1IjoiYXRtaWthcGFpMTMiLCJhIjoiY21idHR4eTJpMDdhMjJsb20zNmZheTZ6ayJ9.d_bQSBzesyiCUMA-YHRoIA";

interface MapboxGlobeProps {
  selectedProject?: any;
  onCitySelect?: (city: string) => void;
}

export default function MapboxGlobe({ selectedProject, onCitySelect }: MapboxGlobeProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-v9",
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
          "circle-color": "#e74c3c",
          "circle-stroke-width": 1,
          "circle-stroke-color": "#e2e8f0",
          "circle-opacity": 0.9,
        },
      });

      map.addLayer({
        id: "city-labels",
        type: "symbol",
        source: "cities",
        layout: {
          "text-field": ["get", "name"],
          "text-size": 12,
          "text-offset": [0, 1.5],
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
        console.log("City from marker:", cityName, "| Project cities:", (projects as any[]).map(p => p.city));

        // Find projects for this city
        const cityProjects = (projects as any[]).filter(
          (proj) => {
            const match = proj.city.trim().toLowerCase() === cityName.trim().toLowerCase();
            console.log(`Comparing "${proj.city.trim().toLowerCase()}" to "${cityName.trim().toLowerCase()}":`, match);
            return match;
          }
        );

        let popupContent = `<div class="project-popup">`;
        if (cityProjects.length === 0) {
          popupContent += `<p>No projects for this city yet.</p>`;
        } else {
          popupContent += `<div class="project-collage">`;
          cityProjects.forEach((proj, idx) => {
            const sizeClass = `size${(idx % 3) + 1}`; // Rotate through 3 sizes for visual interest
            popupContent += `
              <div class="project-image-container ${sizeClass}">
                <a href="${proj.link}" target="_blank" class="project-image-link">
                  <img src="/assets/${proj.image}" alt="${proj.title}" class="project-image" />
                  <div class="project-overlay">
                    <h3>${proj.title}</h3>
                  </div>
                </a>
              </div>
            `;
          });
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

  // Fly to project location when selectedProject changes
  useEffect(() => {
    if (!selectedProject || !mapRef.current) return;
    console.log('Selected project city:', selectedProject.city);
    console.log('Available cities:', project_cities.map(c => c.name));
    const city = project_cities.find(
      (c) => c.name.trim().toLowerCase() === selectedProject.city.trim().toLowerCase()
    );
    if (city) {
      console.log('Found city match:', city);
      mapRef.current.flyTo({
        center: [city.longitude, city.latitude],
        zoom: 4,
        essential: true,
      });
    } else {
      console.warn('No city match found for:', selectedProject.city);
    }
  }, [selectedProject]);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
    />
  );
} 
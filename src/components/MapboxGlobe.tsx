import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import projects from "../projects.json";
import placeData from '../places.json';
import Ticker from './Ticker';

// Project cities data
const project_cities = [
    { id: 1, name: "New York", country: "USA", longitude: -73.95630, latitude: 40.75581 }, 
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
    { id: 18, name: "West Village", country: "USA", longitude: -74.0048, latitude: 40.7347 },
    { id: 19, name: "Central Park", country: "USA", longitude: -73.9654, latitude: 40.7829 },
    { id: 27, name: "Cafe Aviva, Roosevelt Island", country: "USA", longitude: -73.94989719622808, latitude: 40.76205528704795 },
    { id: 20, name: "Brooklyn (BK11)", country: "USA", borough: "Brooklyn", longitude: -73.9332, latitude: 40.6536 },
    { id: 21, name: "Brooklyn (BK17)", country: "USA", borough: "Brooklyn", longitude: -73.9225, latitude: 40.6496 },
    { id: 22, name: "Bronx (BX5)", country: "USA", borough: "Bronx", longitude: -73.9020, latitude: 40.8317 },
    { id: 23, name: "Manhattan (MN10)", country: "USA", borough: "Manhattan", longitude: -73.9465, latitude: 40.8116 },
    { id: 24, name: "Queens (QN2)", country: "USA", borough: "Queens", longitude: -73.9326, latitude: 40.7612 },
    { id: 25, name: "Lower Manhattan", country: "USA", longitude: -74.0090, latitude: 40.7075 },
    { id: 26, name: "Christchurch", country: "New Zealand", longitude: 172.6306, latitude: -43.5321 },
    { id: 28, name: "London", country: "USA", longitude: 0.1281, latitude: 51.5080 },
  ];

const zoomGatedCities = ["Walnut Creek", "New Jersey", "Oakland", "Berkeley", "West Hollywood",
  "Brooklyn (BK11)", "Brooklyn (BK17)", "Bronx (BX5)", "Manhattan (MN10)", "Queens (QN2)", 
  "Lower Manhattan", "Christchurch", "Cafenated, North Berkeley", "Cafe Aviva, Roosevelt Island", "London", "West Village", "Central Park"
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
  const popupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moveEndListenerRef = useRef<(() => void) | null>(null);
  const programmaticZoomRef = useRef(false);
  const selectedMarkerRef = useRef<string | null>(null);
  const ZOOM_THRESHOLD = 2.5;

  const tickerCityOrder = ['New York', 'San Francisco', 'Berkeley', 'Oakland', 'San Diego', 'Mumbai'];
  const tickerCities = tickerCityOrder
    .map(cityName => project_cities.find(city => city.name === cityName))
    .filter((city): city is typeof project_cities[number] => Boolean(city));

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

    // Find city info (place_description, date, playlist)
    const cityData = (placeData as any[]).find(
      (entry) => entry.city.trim().toLowerCase() === cityName.trim().toLowerCase()
    );

    let popupContent = `<div class="city-popup" style="text-align:center; max-height:250px; overflow:auto; scrollbar-width: none; -ms-overflow-style: none;">`;
    if (!cityData) {
      popupContent += ``;
    } else {
      popupContent += `<div class="city-description">`;
      popupContent += `<h3 style='margin-bottom: 3px; text-align:center;color:#007bff;'>${cityName}</h3>`;
      if (cityData.image) {
        popupContent += `<img src='${cityData.image}' alt='${cityName}' style='display:block;margin:0 auto 10px auto;max-width:320px; width:100%;height:auto;border-radius:10px;' onerror='console.error(\"Failed to load image:\", this.src)' onload='console.log(\"Image loaded successfully:\", this.src)' loading='lazy' />`;
      }
      popupContent += `<div style='font-size:0.7rem;color:#bdbdbd;margin-bottom:3px;text-align:center; font-style:italic;'><em>${cityData.date || ''}</em></div>`;
      popupContent += `<div style='font-size:0.5rem;color:#e0e0e0;text-align:center; font-style:italic;line-height:1.2;'>${cityData.place_description || ''}</div>`;
      if (cityData.playlist) {
        popupContent += `<div class='popup-playlist' style=' font-size:0.5rem;'><a href='${cityData.playlist}' target='_blank' rel='noopener noreferrer'>my playlist</a></div>`;
      }
      popupContent += `</div>`;
    }
    popupContent += `</div>`;

    // Pause rotation when popup opens
    rotationEnabled.current = false;
    
    // Offset the popup slightly to the right of the marker
    const offsetLngLat: [number, number] = [lngLat[0] - 0.005, lngLat[1]];
    
    // Use larger width if there's an image
    const popupWidth = cityData?.image ? '350px' : '250px';
    
    const popup = new mapboxgl.Popup({ maxWidth: popupWidth, anchor: 'right'})
      .setLngLat(offsetLngLat)
      .setHTML(popupContent)
      .addTo(mapRef.current);

    activePopup.current = popup;
    
    // Resume rotation when popup closes
    popup.on('close', () => {
      rotationEnabled.current = true;
      if (onCitySelect) onCitySelect(null);
      activePopup.current = null;
      
      // Clear selected marker
      selectedMarkerRef.current = null;
      
      // Refresh the marker layer to reset colors
      if (mapRef.current && mapRef.current.getLayer("city-markers")) {
        mapRef.current.removeLayer("city-markers");
        mapRef.current.addLayer({
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
              ["==", ["get", "name"], selectedMarkerRef.current], "#007bff",
              ["case",
                ["in", ["get", "name"], ["literal", zoomGatedCities]], "#ed462b",
                "#ed462b"
              ]
            ],
            "circle-stroke-width": [
              "case",
              ["==", ["get", "name"], selectedMarkerRef.current], 2,
              1
            ],
            "circle-stroke-color": [
              "case",
              ["==", ["get", "name"], selectedMarkerRef.current], "#ffffff",
              "#000000"
            ],
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
      }
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
      style: "mapbox://styles/mapbox/standard", //satellite-v9 //satellite-streets-v12 //outdoors-v12
      projection: "globe",
      center: [-100, 40],
      zoom: isMobile ? 0.30 : 1.7,
      bearing: 0,
      pitch: 0,
      minZoom: isMobile ? 0.30 : 1.4,
      attributionControl: false,
    });
    mapRef.current = map;
    
     // @ts-ignore
    //map.addControl(new mapboxgl.LightControl(), 'top-left');
    


    map.on("style.load", () => {
      console.log("Loaded projects:", projects);
      map.setFog({
        color: "rgb(95, 174, 253)",
        "high-color": "rgb(6, 113, 189)",
        "horizon-blend": 0.05,
        "space-color": "rgb(21, 21, 21)", //// //rgb(1, 31, 52)
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
            ["==", ["get", "name"], selectedMarkerRef.current], "#007bff",
            ["case",
              ["in", ["get", "name"], ["literal", zoomGatedCities]], "#ed462b",
              "#ed462b"
            ]
          ],
          "circle-stroke-width": [
            "case",
            ["==", ["get", "name"], selectedMarkerRef.current], 2,
            1
          ],
          "circle-stroke-color": [
            "case",
            ["==", ["get", "name"], selectedMarkerRef.current], "#ffffff",
            "#000000"
          ],
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



      // Popup on marker click
      map.on("click", "city-markers", (e) => {
        const cityName = e.features?.[0]?.properties?.name;
        if (!cityName) return;
        
        // Update selected marker
        selectedMarkerRef.current = cityName;
        
        // Refresh the marker layer to update colors
        if (map.getLayer("city-markers")) {
          map.removeLayer("city-markers");
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
                ["==", ["get", "name"], selectedMarkerRef.current], "#007bff",
                ["case",
                  ["in", ["get", "name"], ["literal", zoomGatedCities]], "#ed462b",
                  "#ed462b"
                ]
              ],
              "circle-stroke-width": [
                "case",
                ["==", ["get", "name"], selectedMarkerRef.current], 2,
                1
              ],
              "circle-stroke-color": [
                "case",
                ["==", ["get", "name"], selectedMarkerRef.current], "#ffffff",
                "#000000"
              ],
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
        }
        
        if (onCitySelect) onCitySelect(cityName);
        createCityPopup(cityName, [e.lngLat.lng, e.lngLat.lat]);
      });

      // Clear city selection when clicking on map background
      map.on("click", (e) => {
        // Only clear if not clicking on a city marker
        const features = map.queryRenderedFeatures(e.point, { layers: ['city-markers'] });
        if (features.length === 0 && onCitySelect) {
          onCitySelect(null);
          
          // Clear selected marker
          selectedMarkerRef.current = null;
          
          // Refresh the marker layer to reset colors
          if (map.getLayer("city-markers")) {
            map.removeLayer("city-markers");
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
                  ["==", ["get", "name"], selectedMarkerRef.current], "#007bff",
                  ["case",
                    ["in", ["get", "name"], ["literal", zoomGatedCities]], "#ed462b",
                    "#ed462b"
                  ]
                ],
                "circle-stroke-width": [
                  "case",
                  ["==", ["get", "name"], selectedMarkerRef.current], 2,
                  1
                ],
                "circle-stroke-color": [
                  "case",
                  ["==", ["get", "name"], selectedMarkerRef.current], "#ffffff",
                  "#000000"
                ],
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
          }
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

    function rotateGlobe() {
      const currentZoom = map.getZoom();
      if (rotationEnabled.current && !isUserInteracting && currentZoom < ZOOM_THRESHOLD) {
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

    // Listen for zoomend to resume rotation if user zooms out
    const onZoomEnd = () => {
      if (programmaticZoomRef.current) {
        // Ignore this zoomend if it was programmatic
        programmaticZoomRef.current = false;
        return;
      }
      const currentZoom = map.getZoom();
      if (currentZoom <= ZOOM_THRESHOLD) {
        rotationEnabled.current = true;
      } else {
        rotationEnabled.current = false;
      }
    };
    map.on('zoomend', onZoomEnd);

    return () => {
      map.remove();
      map.off('zoomend', onZoomEnd);
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        ref={mapContainer}
        style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
      />

      {!showDisclaimer && window.innerWidth > 600 && (
        <Ticker
          items={tickerCities}
          map={mapRef.current}
          onCityClick={handleTickerClick}
          onCitySelect={onCitySelect}
          onCityPopup={(city) => {
            // Cancel any pending popup
            if (popupTimeoutRef.current) {
              clearTimeout(popupTimeoutRef.current);
              popupTimeoutRef.current = null;
            }
            // Remove previous moveend listener
            if (moveEndListenerRef.current && mapRef.current) {
              mapRef.current.off('moveend', moveEndListenerRef.current);
              moveEndListenerRef.current = null;
            }
            // Close any open popup
            if (activePopup.current) {
              activePopup.current.remove();
              activePopup.current = null;
            }
            
            // Update selected marker
            selectedMarkerRef.current = city.name;
            
            // Refresh the marker layer to update colors
            if (mapRef.current && mapRef.current.getLayer("city-markers")) {
              mapRef.current.removeLayer("city-markers");
              mapRef.current.addLayer({
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
                    ["==", ["get", "name"], selectedMarkerRef.current], "#007bff",
                    ["case",
                      ["in", ["get", "name"], ["literal", zoomGatedCities]], "#ed462b",
                      "#ed462b"
                    ]
                  ],
                  "circle-stroke-width": [
                    "case",
                    ["==", ["get", "name"], selectedMarkerRef.current], 2,
                    1
                  ],
                  "circle-stroke-color": [
                    "case",
                    ["==", ["get", "name"], selectedMarkerRef.current], "#ffffff",
                    "#000000"
                  ],
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
            }
            
            // Set up moveend listener for popup
            if (mapRef.current) {
              programmaticZoomRef.current = true;
              const showPopup = () => {
                createCityPopup(city.name, [city.longitude, city.latitude]);
                if (mapRef.current && moveEndListenerRef.current) {
                  mapRef.current.off('moveend', moveEndListenerRef.current);
                  moveEndListenerRef.current = null;
                }
              };
              moveEndListenerRef.current = showPopup;
              mapRef.current.on('moveend', showPopup);
            }
          }}
        />
      )}
    </div>
  );
} 
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Cloud, Thermometer, Droplets, Wind, Eye, Gauge } from 'lucide-react';

const algeriaCenter = [28.0339, 1.6596];
const API_KEY = 'df49157699629ac08a45a675a5c7c1e2';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxWidthHeight: '100vh',
    padding: '0px',
    marginLeft: '0px'
  },
  contentWrapper: {
    width: '100%',
    maxWidth: '800px',
    marginBottom: '13px',
    marginLeft: '100px'
  },
  title: {
    fontSize: '30px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
    marginBottom: '32px'
  },
  layerControls: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    marginBottom: '24px',
    minHeight: '120px'
  },
  layerTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '12px',
    textAlign: 'center'
  },
  layerButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '8px'
  },
  layerButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },
  layerButtonActive: {
    color: '#ffffff',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  layerButtonInactive: {
    backgroundColor: '#f3f4f6',
    color: '#000000'
  },
  mapWrapper: {
    width: '100%',
    maxWidth: '900px',
  },
  mapContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '16px',
    marginLeft: '100px'
  },
  mapHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px'
  },
  mapTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ffffff'
  },
  activeLayerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#ffffff'
  },
  activeLayerLabel: {
    fontWeight: '500',
    color: '#ffffff'
  },
  mapInner: {
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
  }
};

// Add comprehensive CSS for all text elements
const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Leaflet zoom controls */
  .leaflet-control-zoom a {
    color: #000000 !important;
    text-decoration: none !important;
    font-weight: bold !important;
  }
  
  .leaflet-control-zoom a:hover {
    color: #000000 !important;
  }
  
  /* Leaflet popup styling */
  .leaflet-popup-content-wrapper {
    background-color: white !important;
  }
  
  .leaflet-popup-content {
    color: #000000 !important;
  }
  
  .leaflet-popup-content h3 {
    color: #000000 !important;
    margin: 0 0 8px 0 !important;
  }
  
  .leaflet-popup-content p {
    color: #000000 !important;
    margin: 0 !important;
  }
  
  .leaflet-popup-content div {
    color: #000000 !important;
  }
  
  /* Attribution text */
  .leaflet-control-attribution {
    color: #000000 !important;
  }
  
  .leaflet-control-attribution a {
    color: #000000 !important;
  }
`;

// Inject the styles into the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}

const WeatherMap = () => {
  const [activeLayer, setActiveLayer] = useState('temp');
  const [hoveredButton, setHoveredButton] = useState(null);
  
  const weatherLayers = [
    {
      id: 'temp',
      name: 'Temperature',
      url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
      opacity: 0.6,
      icon: <Thermometer style={{ width: '16px', height: '16px', color: '#000000' }} />,
      color: '#ef4444'
    },
    {
      id: 'clouds',
      name: 'Clouds',
      url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
      opacity: 0.5,
      icon: <Cloud style={{ width: '16px', height: '16px', color: '#000000' }} />,
      color: '#6b7280'
    },
    {
      id: 'precipitation',
      name: 'Precipitation',
      url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
      opacity: 0.6,
      icon: <Droplets style={{ width: '16px', height: '16px', color: '#000000' }} />,
      color: '#3b82f6'
    },
    {
      id: 'pressure',
      name: 'Pressure',
      url: `https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
      opacity: 0.5,
      icon: <Gauge style={{ width: '16px', height: '16px', color: '#000000' }} />,
      color: '#8b5cf6'
    },
    {
      id: 'wind',
      name: 'Wind',
      url: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
      opacity: 0.6,
      icon: <Wind style={{ width: '16px', height: '16px', color: '#000000' }} />,
      color: '#10b981'
    }
  ];

  const handleLayerChange = (layerId) => {
    setActiveLayer(layerId);
  };

  const activeLayerData = weatherLayers.find(layer => layer.id === activeLayer);

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <div style={styles.layerControls}>
          <h3 style={styles.layerTitle}>Weather Layers</h3>
          <div style={styles.layerButtons}>
            {weatherLayers.map((layer) => (
              <button
                key={layer.id}
                onClick={() => handleLayerChange(layer.id)}
                style={{
                  ...styles.layerButton,
                  ...(activeLayer === layer.id 
                    ? { 
                        ...styles.layerButtonActive, 
                        backgroundColor: layer.color,
                        color: '#ffffff'
                      }
                    : { 
                        ...styles.layerButtonInactive,
                        color: '#000000'
                      }
                  )
                }}
                onMouseEnter={() => setHoveredButton(layer.id)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <span style={{ color: '#000000', display: 'flex', alignItems: 'center' }}>
                  {React.cloneElement(layer.icon, { color: '#000000' })}
                </span>
                <span style={{ color: activeLayer === layer.id ? '#ffffff' : '#000000' }}>
                  {layer.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.mapWrapper}>
        <div style={styles.mapContainer}>
          <div style={styles.mapHeader}>
            <h2 style={styles.mapTitle}>Interactive Weather Map</h2>
            <div style={styles.activeLayerInfo}>
              <span style={{ color: '#ffffff' }}>Active Layer:</span>
              <span style={{ ...styles.activeLayerLabel, color: '#ffffff' }}>
                {activeLayerData?.name}
              </span>
            </div>
          </div>
          
          <div style={styles.mapInner}>
            <MapContainer
              center={algeriaCenter}
              zoom={6}
              style={{ height: '400px', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {activeLayerData && (
                <TileLayer
                  url={activeLayerData.url}
                  opacity={activeLayerData.opacity}
                  key={activeLayerData.id}
                />
              )}
              
              <Marker position={algeriaCenter}>
                <Popup>
                  <div style={{ padding: '8px', color: '#000000' }}>
                    <h3 style={{ 
                      fontWeight: 'bold', 
                      fontSize: '18px', 
                      marginBottom: '8px', 
                      color: '#000000' 
                    }}>
                      Algeria (Center)
                    </h3>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '4px', 
                      fontSize: '14px', 
                      color: '#000000' 
                    }}>
                      <p style={{ color: '#000000', margin: 0 }}>
                        Weather layer: {activeLayerData?.name}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;
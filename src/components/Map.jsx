import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Cloud, Thermometer, Droplets, Wind, Eye, Gauge } from 'lucide-react';

const algeriaCenter = [28.0339, 1.6596];
const API_KEY = 'df49157699629ac08a45a675a5c7c1e2';

// All 58 Wilayas (provinces) of Algeria
const algeriaWilayas = [
  { name: 'Adrar', position: [27.8742, -0.2936], code: '01' },
  { name: 'Chlef', position: [36.1654, 1.3347], code: '02' },
  { name: 'Laghouat', position: [33.8008, 2.8648], code: '03' },
  { name: 'Oum El Bouaghi', position: [35.8753, 7.1138], code: '04' },
  { name: 'Batna', position: [35.5559, 6.1741], code: '05' },
  { name: 'Béjaïa', position: [36.7594, 5.0689], code: '06' },
  { name: 'Biskra', position: [34.8481, 5.7281], code: '07' },
  { name: 'Béchar', position: [31.6177, -2.2258], code: '08' },
  { name: 'Blida', position: [36.4203, 2.8277], code: '09' },
  { name: 'Bouira', position: [36.3739, 3.9000], code: '10' },
  { name: 'Tamanrasset', position: [22.7851, 5.5228], code: '11' },
  { name: 'Tébessa', position: [35.4075, 8.1244], code: '12' },
  { name: 'Tlemcen', position: [34.8789, -1.3150], code: '13' },
  { name: 'Tiaret', position: [35.3712, 1.3170], code: '14' },
  { name: 'Tizi Ouzou', position: [36.7118, 4.0435], code: '15' },
  { name: 'Algiers', position: [36.7538, 3.0588], code: '16' },
  { name: 'Djelfa', position: [34.6792, 3.2631], code: '17' },
  { name: 'Jijel', position: [36.8190, 5.7669], code: '18' },
  { name: 'Sétif', position: [36.1906, 5.4106], code: '19' },
  { name: 'Saïda', position: [34.8306, 0.1514], code: '20' },
  { name: 'Skikda', position: [36.8761, 6.9094], code: '21' },
  { name: 'Sidi Bel Abbès', position: [35.1878, -0.6308], code: '22' },
  { name: 'Annaba', position: [36.9000, 7.7667], code: '23' },
  { name: 'Guelma', position: [36.4615, 7.4281], code: '24' },
  { name: 'Constantine', position: [36.3650, 6.6147], code: '25' },
  { name: 'Médéa', position: [36.2686, 2.7531], code: '26' },
  { name: 'Mostaganem', position: [35.9315, 0.0892], code: '27' },
  { name: 'M\'Sila', position: [35.7017, 4.5413], code: '28' },
  { name: 'Mascara', position: [35.3964, 0.1406], code: '29' },
  { name: 'Ouargla', position: [31.9465, 5.3317], code: '30' },
  { name: 'Oran', position: [35.6976, -0.6337], code: '31' },
  { name: 'El Bayadh', position: [33.6806, 1.0194], code: '32' },
  { name: 'Illizi', position: [26.4833, 8.4667], code: '33' },
  { name: 'Bordj Bou Arréridj', position: [36.0731, 4.7608], code: '34' },
  { name: 'Boumerdès', position: [36.7667, 3.4833], code: '35' },
  { name: 'El Tarf', position: [36.7672, 8.3136], code: '36' },
  { name: 'Tindouf', position: [27.6700, -8.1475], code: '37' },
  { name: 'Tissemsilt', position: [35.6069, 1.8114], code: '38' },
  { name: 'El Oued', position: [33.3561, 6.8675], code: '39' },
  { name: 'Khenchela', position: [35.4361, 7.1436], code: '40' },
  { name: 'Souk Ahras', position: [36.2866, 7.9506], code: '41' },
  { name: 'Tipaza', position: [36.5944, 2.4467], code: '42' },
  { name: 'Mila', position: [36.4503, 6.2650], code: '43' },
  { name: 'Aïn Defla', position: [36.2639, 1.9681], code: '44' },
  { name: 'Naâma', position: [33.2667, -0.3000], code: '45' },
  { name: 'Aïn Témouchent', position: [35.2981, -1.1406], code: '46' },
  { name: 'Ghardaïa', position: [32.4911, 3.6736], code: '47' },
  { name: 'Relizane', position: [35.7369, 0.5561], code: '48' },
  { name: 'Timimoun', position: [29.2631, 0.2411], code: '49' },
  { name: 'Bordj Badji Mokhtar', position: [21.3281, 0.9256], code: '50' },
  { name: 'Ouled Djellal', position: [34.4167, 5.1000], code: '51' },
  { name: 'Béni Abbès', position: [30.1306, -2.1667], code: '52' },
  { name: 'In Salah', position: [27.2167, 2.4833], code: '53' },
  { name: 'In Guezzam', position: [19.5667, 5.7667], code: '54' },
  { name: 'Touggourt', position: [33.1069, 6.0581], code: '55' },
  { name: 'Djanet', position: [24.5544, 9.4841], code: '56' },
  { name: 'El M\'Ghair', position: [33.9500, 5.9167], code: '57' },
  { name: 'El Menia', position: [30.5833, 2.8833], code: '58' }
];

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
  },
  wilayaCount: {
    fontSize: '12px',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: '8px',
    opacity: 0.8
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
              style={{ height: '500px', width: '100%' }}
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
              
              {algeriaWilayas.map((wilaya, index) => (
                <Marker key={index} position={wilaya.position}>
                  <Popup>
                    <div style={{ padding: '8px', color: '#000000' }}>
                      <h3 style={{ 
                        fontWeight: 'bold', 
                        fontSize: '18px', 
                        marginBottom: '8px', 
                        color: '#000000' 
                      }}>
                        {wilaya.name}
                      </h3>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '4px', 
                        fontSize: '14px', 
                        color: '#000000' 
                      }}>
                        <p style={{ color: '#000000', margin: 0 }}>
                          Wilaya Number: {wilaya.code}
                        </p>
                        <p style={{ color: '#000000', margin: 0 }}>
                          Weather layer: {activeLayerData?.name}
                        </p>
                        
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;
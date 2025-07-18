import React, { useEffect, useState } from "react";
import { Cloud, Droplets, Wind, Eye, Thermometer, Gauge, Sunrise, Sunset, Navigation } from "lucide-react";

const API_KEY = "df49157699629ac08a45a675a5c7c1e2";

// Enhanced weather icon mapping with comprehensive conditions
const weatherIconMap = {
  // Clear conditions
  Clear: "☀️",
  "clear sky": "☀️",
  
  // Cloud conditions
  Clouds: "☁️",
  "few clouds": "⛅",
  "scattered clouds": "🌤️",
  "broken clouds": "☁️",
  "overcast clouds": "☁️",
  
  // Rain conditions
  Rain: "🌧️",
  Drizzle: "🌦️",
  "light rain": "🌦️",
  "moderate rain": "🌧️",
  "heavy intensity rain": "🌧️",
  "very heavy rain": "🌧️",
  "extreme rain": "🌧️",
  "shower rain": "🌧️",
  "light intensity shower rain": "🌧️",
  "heavy intensity shower rain": "🌧️",
  "ragged shower rain": "🌧️",
  
  // Storm conditions
  Thunderstorm: "⛈️",
  "thunderstorm with light rain": "⛈️",
  "thunderstorm with rain": "⛈️",
  "thunderstorm with heavy rain": "⛈️",
  "light thunderstorm": "⛈️",
  "thunderstorm with light drizzle": "⛈️",
  "thunderstorm with drizzle": "⛈️",
  "thunderstorm with heavy drizzle": "⛈️",
  "heavy thunderstorm": "⛈️",
  "ragged thunderstorm": "⛈️",
  
  // Snow conditions
  Snow: "❄️",
  "light snow": "🌨️",
  "heavy snow": "❄️",
  "sleet": "🌨️",
  "light shower sleet": "🌨️",
  "shower sleet": "🌨️",
  "light rain and snow": "🌨️",
  "rain and snow": "🌨️",
  "light shower snow": "🌨️",
  "shower snow": "❄️",
  "heavy shower snow": "❄️",
  
  // Atmospheric conditions
  Mist: "🌫️",
  Smoke: "🌫️",
  Haze: "🌫️",
  "sand/ dust whirls": "🌪️",
  Fog: "🌫️",
  Sand: "🌪️",
  Dust: "🌫️",
  "volcanic ash": "🌫️",
  Squall: "⛈️",
  Tornado: "🌪️",
  
  // Default fallback
  default: "☀️"
};

// Night icon mapping based on icon codes
const getNightIcon = (iconCode, description) => {
  if (!iconCode) return "🌙";
  
  // Night icons (when iconCode ends with 'n')
  if (iconCode.endsWith('n')) {
    const baseCode = iconCode.slice(0, -1);
    switch (baseCode) {
      case '01': return "🌙"; // clear sky night
      case '02': return "⭐"; // few clouds night
      case '03': return "☁️"; // scattered clouds night
      case '04': return "☁️"; // broken clouds night
      case '09': return "🌧️"; // shower rain night
      case '10': return "🌧️"; // rain night
      case '11': return "⛈️"; // thunderstorm night
      case '13': return "❄️"; // snow night
      case '50': return "🌫️"; // mist night
      default: return "🌙";
    }
  }
  
  // Day icons - use the regular mapping
  return weatherIconMap[description] || weatherIconMap.default;
};

// Helper function to render weather icon with dynamic day/night awareness
const renderWeatherIcon = (weatherData) => {
  if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
    return "☀️";
  }

  const iconCode = weatherData.weather[0].icon;
  const description = weatherData.weather[0].description.toLowerCase();
  const mainCondition = weatherData.weather[0].main;
  
  // Get appropriate icon (day/night aware)
  const emoji = getNightIcon(iconCode, description) || 
                weatherIconMap[mainCondition] || 
                weatherIconMap[description] || 
                weatherIconMap.default;

  return emoji;
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    minHeight: "65vh",
    padding: "1rem"
  },
  card: {
    backgroundColor: "white",
    borderRadius: "1.5rem",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    maxWidth: "950px",
    width: "100%",
    display: "flex",
    marginLeft:"20px",
    minHeight: "400px",
  },
  header: {
    background: "linear-gradient(135deg, #667eea 0%,rgb(75, 84, 162) 100%)",
    padding: "1.5rem",
    textAlign: "center",
    color: "white",
    flex: "0 0 300px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  dateTime: {
    fontSize: "0.8rem",
    opacity: 0.8,
    marginBottom: "0.3rem"
  },
  weatherIcon: {
    fontSize: "3rem",
    marginBottom: "0.5rem"
  },
  temperature: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "0.3rem"
  },
  location: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "0.2rem"
  },
  description: {
    fontSize: "0.9rem",
    opacity: 0.9,
    textTransform: "capitalize",
    marginBottom: "0.5rem"
  },
  tempRange: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    fontSize: "0.8rem",
    opacity: 0.8
  },
  content: {
    padding: "1rem",
    flex: "1"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem",
    marginBottom: "0.75rem"
  },
  sunGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem",
  },
  detailCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: "0.75rem",
    padding: "0.75rem"
  },
  detailHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    marginBottom: "0.3rem"
  },
  detailLabel: {
    color: "#666",
    fontSize: "0.65rem",
    fontWeight: "500",
    letterSpacing: "0.3px"
  },
  detailValue: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#000"
  },
  detailUnit: {
    fontSize: "0.65rem",
    color: "#666"
  },
  sunCard: {
    borderRadius: "0.75rem",
    padding: "0.75rem"
  },
  sunriseCard: {
    background: "linear-gradient(135deg, #fff9c4 0%, #ffcc5c 100%)"
  },
  sunsetCard: {
    background: "linear-gradient(135deg, #ffcc5c 0%, #ff6b6b 100%)"
  },
  sunValue: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#000"
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh"
  },
  loadingCard: {
    backgroundColor: "white",
    borderRadius: "2rem",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    padding: "2rem",
    textAlign: "center",
    maxWidth: "400px",
    margin: "0 auto"
  },
  spinner: {
    width: "3rem",
    height: "3rem",
    border: "4px solid #e3e3e3",
    borderTop: "4px solid #667eea",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 1rem"
  },
  loadingText: {
    color: "#666",
    fontSize: "1.1rem",
    fontWeight: "500"
  },
  errorText: {
    color: "#dc3545",
    fontSize: "1.1rem",
    fontWeight: "500"
  },
  errorIcon: {
    fontSize: "4rem",
    marginBottom: "1rem"
  }
};

const CurrentLocation = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        )
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch weather data.");
            return res.json();
          })
          .then((data) => {
            setWeather(data);
            setLoading(false);
          })
          .catch(() => {
            setError("Failed to fetch weather data.");
            setLoading(false);
          });
      },
      (err) => {
        setError("Unable to retrieve your location.");
        setLoading(false);
      }
    );
  }, []);

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Getting your location...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingCard}>
          <div style={styles.errorIcon}>❌</div>
          <p style={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Main Weather Section */}
        <div style={styles.header}>
          <div style={styles.dateTime}>
            {currentTime.toLocaleDateString([], { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })} • {currentTime.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
          
          <div style={styles.weatherIcon}>
            {renderWeatherIcon(weather)}
          </div>
          
          <div style={styles.temperature}>
            {Math.round(weather.main.temp)}°C
          </div>
          
          <div style={styles.location}>
            {weather.name}, {weather.sys?.country}
          </div>
          
          <div style={styles.description}>
            {weather.weather[0].description}
          </div>
          
          <div style={styles.tempRange}>
            <span>Feels like {Math.round(weather.main.feels_like)}°C</span>
            <span>•</span>
            <span>H: {Math.round(weather.main.temp_max)}°C</span>
            <span>•</span>
            <span>L: {Math.round(weather.main.temp_min)}°C</span>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div style={styles.content}>
          <div style={styles.grid}>
            {/* Humidity */}
            <div style={styles.detailCard}>
              <div style={styles.detailHeader}>
                <Droplets size={18} color="#667eea" />
                <span style={styles.detailLabel}>HUMIDITY</span>
              </div>
              <div style={styles.detailValue}>{weather.main.humidity}%</div>
            </div>

            {/* Wind */}
            <div style={styles.detailCard}>
              <div style={styles.detailHeader}>
                <Wind size={18} color="#667eea" />
                <span style={styles.detailLabel}>WIND</span>
              </div>
              <div style={styles.detailValue}>{weather.wind?.speed || 0} m/s</div>
              <div style={styles.detailUnit}>
                {weather.wind?.deg ? getWindDirection(weather.wind.deg) : 'N/A'}
              </div>
            </div>
          </div>

          <div style={styles.grid}>
            {/* Pressure */}
            <div style={styles.detailCard}>
              <div style={styles.detailHeader}>
                <Gauge size={18} color="#667eea" />
                <span style={styles.detailLabel}>PRESSURE</span>
              </div>
              <div style={styles.detailValue}>{weather.main.pressure}</div>
              <div style={styles.detailUnit}>hPa</div>
            </div>

            {/* Visibility */}
            <div style={styles.detailCard}>
              <div style={styles.detailHeader}>
                <Eye size={18} color="#667eea" />
                <span style={styles.detailLabel}>VISIBILITY</span>
              </div>
              <div style={styles.detailValue}>
                {weather.visibility ? Math.round(weather.visibility / 1000) : 'N/A'}
              </div>
              <div style={styles.detailUnit}>km</div>
            </div>
          </div>

          <div style={styles.grid}>
            {/* Sunrise */}
            <div style={{...styles.sunCard, ...styles.sunriseCard}}>
              <div style={styles.detailHeader}>
                <Sunrise size={18} color="#f59e0b" />
                <span style={styles.detailLabel}>SUNRISE</span>
              </div>
              <div style={styles.sunValue}>
                {formatTime(weather.sys.sunrise)}
              </div>
            </div>

            {/* Sunset */}
            <div style={{...styles.sunCard, ...styles.sunsetCard}}>
              <div style={styles.detailHeader}>
                <Sunset size={18} color="#ef4444" />
                <span style={styles.detailLabel}>SUNSET</span>
              </div>
              <div style={styles.sunValue}>
                {formatTime(weather.sys.sunset)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentLocation;
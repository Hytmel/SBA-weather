import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Thermometer, Droplets, Wind, Eye, Gauge, Sunrise, Sunset } from "lucide-react";

const Forecast = () => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCity, setSelectedCity] = useState("Your Location");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userLocation, setUserLocation] = useState(null);

  const API_KEY = "dddd398c7652c9c3398a81ee2313e509";

  // Weather icon mapping with night/day conditions (same as Dashboard)
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchForecastData();
    }
  }, [userLocation]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lon: longitude });
        
        // Get city name from coordinates
        fetchCityName(latitude, longitude);
      },
      (err) => {
        setError("Unable to retrieve your location. Please check your location permissions.");
        setLoading(false);
      }
    );
  };

  const fetchCityName = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setSelectedCity(data[0].name);
        }
      }
    } catch (error) {
      console.error("Error fetching city name:", error);
    }
  };

  const fetchForecastData = async () => {
    if (!userLocation) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${userLocation.lat}&lon=${userLocation.lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch forecast data");
      }
      
      const data = await response.json();
      setForecastData(data);
    } catch (err) {
      setError("Failed to load forecast data. Please try again.");
      console.error("Forecast fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
  };

  const getFormattedTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const groupForecastByDay = () => {
    if (!forecastData || !forecastData.list) return [];
    
    const grouped = {};
    
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      
      if (!grouped[dayKey]) {
        grouped[dayKey] = {
          date: date,
          dayName: getDayName(date),
          forecasts: []
        };
      }
      
      grouped[dayKey].forecasts.push(item);
    });
    
    return Object.values(grouped).sort((a, b) => a.date - b.date);
  };

  const getDailySummary = (dayForecasts) => {
    if (!dayForecasts || dayForecasts.length === 0) return null;
    
    const temps = dayForecasts.map(f => f.main.temp);
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    
    // Get the most common weather condition for the day
    const weatherCounts = {};
    dayForecasts.forEach(f => {
      const condition = f.weather[0].main;
      weatherCounts[condition] = (weatherCounts[condition] || 0) + 1;
    });
    
    const mostCommonWeather = Object.keys(weatherCounts).reduce((a, b) => 
      weatherCounts[a] > weatherCounts[b] ? a : b
    );
    
    return {
      maxTemp: Math.round(maxTemp),
      minTemp: Math.round(minTemp),
      avgTemp: Math.round(avgTemp),
      weather: dayForecasts.find(f => f.weather[0].main === mostCommonWeather)?.weather[0] || dayForecasts[0].weather[0]
    };
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      minHeight: "65vh",
      padding: "1rem",
      maxWidth: "1000px",
      marginLeft: "300px",
      marginRight: "1rem"
    },
    header: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: "1.5rem",
      padding: "1.5rem",
      color: "white",
      marginBottom: "1.5rem",
      textAlign: "center"
    },
    headerTitle: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "0.5rem"
    },
    headerSubtitle: {
      fontSize: "0.9rem",
      opacity: 0.9,
      marginBottom: "1rem"
    },
    locationInfo: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      fontSize: "1rem"
    },
    currentTime: {
      fontSize: "0.8rem",
      opacity: 0.8,
      marginTop: "1rem"
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
      maxWidth: "400px"
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
    errorCard: {
      backgroundColor: "white",
      borderRadius: "2rem",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      padding: "2rem",
      textAlign: "center",
      maxWidth: "400px"
    },
    errorIcon: {
      fontSize: "4rem",
      marginBottom: "1rem"
    },
    errorText: {
      color: "#dc3545",
      fontSize: "1.1rem",
      fontWeight: "500"
    },
    daysContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "1rem"
    },
    dayCard: {
      backgroundColor: "white",
      borderRadius: "1rem",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      minWidth: "300px"
    },
    dayHeader: {
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      padding: "0.5rem",
      textAlign: "center",
      borderBottom: "1px solid #dee2e6"
    },
    dayName: {
      fontSize: "1rem",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "0.1rem"
    },
    dayDate: {
      fontSize: "0.7rem",
      color: "#666"
    },
    daySummary: {
      padding: "0.3rem",
      textAlign: "center",
      borderBottom: "1px solid #dee2e6"
    },
    summaryIcon: {
      fontSize: "1.8rem",
      marginBottom: "0.1rem"
    },
    summaryTemp: {
      fontSize: "1.1rem",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "0.1rem"
    },
    summaryDescription: {
      fontSize: "0.7rem",
      color: "#666",
      textTransform: "capitalize"
    },
    tempRange: {
      display: "flex",
      justifyContent: "center",
      gap: "0.5rem",
      fontSize: "0.65rem",
      color: "#666",
      marginTop: "0.1rem"
    },
    hourlyContainer: {
      padding: "0.3rem"
    },
    hourlyTitle: {
      fontSize: "0.75rem",
      fontWeight: "600",
      color: "#333",
      marginBottom: "0.3rem",
      textAlign: "center"
    },
    hourlyGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "0.2rem"
    },
    hourlyCard: {
      backgroundColor: "#f8f9fa",
      borderRadius: "0.3rem",
      padding: "0.3rem",
      textAlign: "center"
    },
    hourlyTime: {
      fontSize: "0.6rem",
      fontWeight: "600",
      color: "#333",
      marginBottom: "0.1rem"
    },
    hourlyIcon: {
      fontSize: "0.9rem",
      marginBottom: "0.1rem"
    },
    hourlyTemp: {
      fontSize: "0.75rem",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "0.1rem"
    },
    hourlyDetails: {
      fontSize: "0.5rem",
      color: "#666"
    },
    detailsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "0.1rem",
      marginTop: "0.1rem"
    },
    detailItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.1rem",
      fontSize: "0.5rem",
      color: "#666"
    }
  };

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
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <p style={{ color: "#666", fontSize: "1.1rem", fontWeight: "500" }}>
            Loading 5-day forecast...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>❌</div>
          <p style={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  const groupedForecast = groupForecastByDay();

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>5-Day Weather Forecast</h1>
        <p style={styles.headerSubtitle}>Detailed weather predictions for the upcoming days</p>
        <div style={styles.locationInfo}>
          <MapPin size={20} />
          <span>{selectedCity}, Algeria</span>
        </div>
        <div style={styles.currentTime}>
          {currentTime.toLocaleDateString([], { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} • {currentTime.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>

      {/* Forecast Days */}
      <div style={styles.daysContainer}>
        {groupedForecast.map((day, index) => {
          const summary = getDailySummary(day.forecasts);
          
          return (
            <div key={index} style={styles.dayCard}>
              {/* Day Header */}
              <div style={styles.dayHeader}>
                <div style={styles.dayName}>{day.dayName}</div>
                <div style={styles.dayDate}>
                  {day.date.toLocaleDateString([], { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>

              {/* Day Summary */}
              {summary && (
                <div style={styles.daySummary}>
                  <div style={styles.summaryIcon}>
                    {renderWeatherIcon({ weather: [summary.weather] })}
                  </div>
                  <div style={styles.summaryTemp}>{summary.avgTemp}°C</div>
                  <div style={styles.summaryDescription}>
                    {summary.weather.description}
                  </div>
                  <div style={styles.tempRange}>
                    <span>H: {summary.maxTemp}°C</span>
                    <span>•</span>
                    <span>L: {summary.minTemp}°C</span>
                  </div>
                </div>
              )}

              {/* Hourly Forecast */}
              <div style={styles.hourlyContainer}>
                <div style={styles.hourlyTitle}>Hourly Forecast</div>
                <div style={styles.hourlyGrid}>
                  {day.forecasts.slice(0, 4).map((forecast, hourIndex) => (
                    <div key={hourIndex} style={styles.hourlyCard}>
                      <div style={styles.hourlyTime}>
                        {getFormattedTime(forecast.dt * 1000)}
                      </div>
                      <div style={styles.hourlyIcon}>
                        {renderWeatherIcon(forecast)}
                      </div>
                      <div style={styles.hourlyTemp}>
                        {Math.round(forecast.main.temp)}°C
                      </div>
                      <div style={styles.hourlyDetails}>
                        {forecast.weather[0].description}
                      </div>
                      
                      {/* Weather Details */}
                      <div style={styles.detailsGrid}>
                        <div style={styles.detailItem}>
                          <Droplets size={10} color="#667eea" />
                          <span>{forecast.main.humidity}%</span>
                        </div>
                        <div style={styles.detailItem}>
                          <Wind size={10} color="#667eea" />
                          <span>{forecast.wind?.speed || 0} m/s</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forecast; 
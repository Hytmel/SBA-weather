import { useState, useEffect } from "react";
import "./Header.css";

const Header = ({ onCitySearch }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCity, setCurrentCity] = useState("Sidi Bel Abbes");
  const [searchError, setSearchError] = useState("");
  const API_KEY = "dddd398c7652c9c3398a81ee2313e509";
  
  useEffect(() => {
    // Fetch weather data for Sidi Bel Abbes on component mount
    fetchWeatherData("Sidi Bel Abbes");
  }, []);
  
  const fetchWeatherData = async (city) => {
    try {
      setLoading(true);
      setSearchError("");
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},DZ&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();
      setWeatherData(data);
      setCurrentCity(data.name);
      
      // Pass the weather data to parent component
      if (onCitySearch) {
        onCitySearch(data);
      }
    } catch (error) {
      setSearchError("City not found. Please try again.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setSearchError(""); // Clear error when user types
  };
  
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      if (searchQuery.trim()) {
        fetchWeatherData(searchQuery.trim());
        setSearchQuery("");
      }
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      fetchWeatherData(searchQuery.trim());
      setSearchQuery("");
    }
  };

  return (
    <section className="header-section">
      <div>
        <ion-icon name="location-outline"></ion-icon>
        <span>{currentCity} , Algeria</span>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a city..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleSearch}
          disabled={loading}
        ></input>
        {loading && <div className="search-loading">Loading...</div>}
        {searchError && <div className="search-error">{searchError}</div>}
        <button 
          className="search-button" 
          onClick={handleSearchClick}
          disabled={loading || !searchQuery.trim()}
        >
          <ion-icon name="search-outline"></ion-icon>
        </button>
      </div>
      <div>
        <ion-icon name="calendar-outline"></ion-icon>
        <ion-icon name="notifications-outline"></ion-icon>
      </div>
    </section>
  );
};
export default Header;

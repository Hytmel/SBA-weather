import { useState, useEffect } from "react";
import "./Header.css";

const Header = ({ onCitySearch }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCity, setCurrentCity] = useState("Sidi Bel Abbes");
  const [searchError, setSearchError] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [shortDate, setShortDate] = useState("");
  const API_KEY = "dddd398c7652c9c3398a81ee2313e509";
  
  useEffect(() => {
    fetchWeatherData("Sidi Bel Abbes");
    const date = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    const formattedDate = `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    const shortFormattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    setCurrentDate(formattedDate);
    setShortDate(shortFormattedDate);
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
    setSearchError("");
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
      <div className="calendar-date">
        <ion-icon name="calendar-outline"></ion-icon>
        <span className="date-full">{currentDate}</span>
        <span className="date-short">{shortDate}</span>
        <ion-icon name="notifications-outline"></ion-icon>
      </div>
    </section>
  );
};
export default Header;

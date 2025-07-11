import { useState, useEffect } from "react";
import "./Header.css";

const Header = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCity, setCurrentCity] = useState("Sidi Bel Abbes");
  const API_KEY = "dddd398c7652c9c3398a81ee2313e509";
  useEffect(() => {
    // Fetch weather data for Sidi Bel Abbes on component mount
    fetchWeatherData("Sidi Bel Abbes");
  }, []);
  const fetchWeatherData = async (city) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},DZ&appid=${API_KEY}&units=metric`
      );
      console.log(response);

      if (!response.ok) {
        throw new Error("Weather data not found");
      }

      const data = await response.json();
       console.log(data); 
      setWeatherData(data);
      setCurrentCity(data.name);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      if (searchQuery.trim()) {
        fetchWeatherData(searchQuery);
        setSearchQuery("");
      }
    }
  };

  return (
    <section className="header-section">
      <div>
        <ion-icon name="location-outline"></ion-icon>
        <span>{currentCity} , Algeria</span>
      </div>
      <div>
        <ion-icon name="search-outline"></ion-icon>
        <input
          type="text"
          placeholder="Search here"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleSearch}
        ></input>
      </div>
      <div>
        <ion-icon name="calendar-outline"></ion-icon>
        <ion-icon name="notifications-outline"></ion-icon>
      </div>
    </section>
  );
};
export default Header;

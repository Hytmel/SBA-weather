import { useState } from "react";
import "./Header.css";

const Header = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCity, setCurrentCity] = useState("Sidi Bel Abbes");
  const API_KEY = "dddd398c7652c9c3398a81ee2313e509";

  return (
    <section className="header-section">
      <div>
        <ion-icon name="location-outline"></ion-icon>
        <span>London , UK</span>
      </div>
      <div>
        <ion-icon name="search-outline"></ion-icon>
        <input type="text" placeholder="Search here "></input>
      </div>
      <div>
        <ion-icon name="calendar-outline"></ion-icon>
        <ion-icon name="notifications-outline"></ion-icon>
      </div>
    </section>
  );
};
export default Header;

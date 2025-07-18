import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import Header from "./components/Header/Header";
import DashBoard from "./components/DashBoard/DashBoard";
import Map from "./components/Map";
import Forecast from "./components/Forecast";
import CurrentLocation from "./components/CurrentLocation";

function App() {
  const [selectedCity, setSelectedCity] = useState(null);

  const handleCitySearch = (cityData) => {
    setSelectedCity(cityData);
  };

  return (
    <Router>
      <NavBar />
      <Header onCitySearch={handleCitySearch} />
      <div className="main-content-fixed">
        <Routes>
          <Route path="/" element={<DashBoard selectedCity={selectedCity} />} />
          <Route path="/map" element={<Map />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/current-location" element={<CurrentLocation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from "react";
import "./NavBar.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <section className="nav-section">
      <nav>
        <img src={logo} alt="Weather App Logo" />
        <ul>
          <li>
            <Link to="/">
              <ion-icon name="home-outline"></ion-icon>
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/map">
              <ion-icon name="map-outline"></ion-icon>
              <span>Map</span>
            </Link>
          </li>
          <li>
            <Link to="/forecast">
              <ion-icon name="calendar-outline"></ion-icon>
              <span>Forecast</span>
            </Link>
          </li>
          <li>
            <Link to="/current-location">
              <ion-icon name="locate-outline"></ion-icon>
              <span>Current Location</span>
            </Link>
          </li>
        </ul>
      </nav>
    </section>
  );
};
export default NavBar;

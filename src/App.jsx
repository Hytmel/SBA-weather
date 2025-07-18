import { useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import Header from "./components/Header/Header";
import DashBoard from "./components/DashBoard/DashBoard";

function App() {
  const [selectedCity, setSelectedCity] = useState(null);

  const handleCitySearch = (cityData) => {
    setSelectedCity(cityData);
  };

  return (
    <>
      <NavBar></NavBar>
      <Header onCitySearch={handleCitySearch}></Header>
      <DashBoard selectedCity={selectedCity}></DashBoard>
    </>
  );
}

export default App;

import "./DashBoard.css";
import sunCloudy from "../../assets/sun-cloudy.png";
import Rain from "../../assets/rain.png";
import PartlySunny from "../../assets/partly-sunny.png";
import SunWindy from "../../assets/sun-windy.png";
import Compass from "../../assets/compass.png";
import Drops from "../../assets/drops.png";
import Ultraviolet from "../../assets/ultraviolet.png";
import { useState, useEffect } from "react";
const DashBoard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [otherCitiesData, setOtherCitiesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_KEY = "dddd398c7652c9c3398a81ee2313e509";
  const otherCities = ["Algiers", "Oran", "Constantine", "Annaba"];
  useEffect(() => {
    fetchAllWeatherData();
  }, []);
  const fetchAllWeatherData = async () => {
    try {
      setLoading(true);

      // Fetch current weather for Sidi Bel Abbes
      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Sidi Bel Abbes,DZ&appid=${API_KEY}&units=metric`
      );
      console.log(currentWeatherResponse.data);

      if (currentWeatherResponse.ok) {
        const currentWeatherData = await currentWeatherResponse.json();
        setWeatherData(currentWeatherData);
      }

      // Fetch 5-day forecast for Sidi Bel Abbes
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=Sidi Bel Abbes,DZ&appid=${API_KEY}&units=metric`
      );
      console.log(forecastResponse.data);

      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        setForecastData(forecastData);
      }

      // Fetch weather for other Algerian cities
      const otherCitiesPromises = otherCities.map((city) =>
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city},DZ&appid=${API_KEY}&units=metric`
        )
          .then((response) => (response.ok ? response.json() : null))
          .catch(() => null)
      );

      const otherCitiesResults = await Promise.all(otherCitiesPromises);
      setOtherCitiesData(otherCitiesResults.filter((data) => data !== null));
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };
  // Helper function to get weather icon based on condition
  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain.toLowerCase()) {
      case "clear":
        return PartlySunny;
      case "clouds":
        return sunCloudy;
      case "rain":
      case "drizzle":
        return Rain;
      case "wind":
        return SunWindy;
      default:
        return sunCloudy;
    }
  };
  // Helper function to get day name
  const getDayName = (dateString) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(dateString);
    return days[date.getDay()];
  };
  // Get next few days from forecast
  const getUpcomingForecast = () => {
    if (!forecastData) return [];

    const today = new Date().getDate();
    const upcomingDays = [];

    for (
      let i = 0;
      i < forecastData.list.length && upcomingDays.length < 2;
      i++
    ) {
      const forecastDate = new Date(forecastData.list[i].dt * 1000);
      if (forecastDate.getDate() !== today) {
        upcomingDays.push(forecastData.list[i]);
      }
    }

    return upcomingDays;
  };

  if (loading) {
    return <div>Loading weather data...</div>;
  }

  return (
    <section className="dashboard-section">
      <div className="home">
        <div className="feed-1">
          <div className="feeds">
            <img
              src={
                weatherData
                  ? getWeatherIcon(weatherData.weather[0].main)
                  : sunCloudy
              }
              alt=""
            />
            <div>
              <div>
                <span>London, UK</span>
                <span>Partly Cloud</span>
              </div>
              <div>
                <span>
                  28 <sup>o</sup>
                </span>
              </div>
            </div>
          </div>
          <div className="feed">
            <div>
              <div>
                <img src={PartlySunny} alt="" />
                <span>
                  14 <sup>o</sup>
                </span>
              </div>
              <div>
                <span>Saturday</span>
                <span>Sun</span>
              </div>
            </div>
            <div>
              <div>
                <img src={SunWindy} alt="" />
                <span>
                  16 <sup>o</sup>
                </span>
              </div>
              <div>
                <span>Saturday</span>
                <span>Wind</span>
              </div>
            </div>
          </div>
        </div>
        <div className="highlights">
          <h2>Today's Highlights</h2>
          <div className="all-highlights">
            <div>
              <div>
                <img src={Compass} alt="" />
                <div>
                  <span>Feel Like</span>
                  <span>Normal</span>
                </div>
              </div>
              <div>
                <span>
                  7 <sup>o</sup>
                </span>
              </div>
            </div>
            <div>
              <div>
                <img src={sunCloudy} alt="" />
                <div>
                  <span>Cloud</span>
                  <span>Heave</span>
                </div>
              </div>
              <div>
                <span>
                  18 <sup>o</sup>
                </span>
              </div>
            </div>
            <div>
              <div>
                <img src={Rain} alt="" />
                <div>
                  <span>Rain</span>
                  <span>Normal</span>
                </div>
              </div>
              <div>
                <span>
                  2 <sup>o</sup>
                </span>
              </div>
            </div>
            <div>
              <div>
                <img src={Drops} alt="" />
                <div>
                  <span>Humidity</span>
                  <span>Heavy</span>
                </div>
              </div>
              <div>
                <span>
                  65 <sup>o</sup>
                </span>
              </div>
            </div>
            <div>
              <div>
                <img src={Ultraviolet} alt="" />
                <div>
                  <span>Ultraviolet</span>
                  <span>Heavy</span>
                </div>
              </div>
              <div>
                <span>
                  7 <sup>o</sup>
                </span>
              </div>
            </div>
            <div>
              <div>
                <img src={PartlySunny} alt="" />
                <div>
                  <span>Cloudy</span>
                  <span>Normal</span>
                </div>
              </div>
              <div>
                <span>
                  26 <sup>km/h</sup>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cities">
        <h2>Other Cities</h2>
        <div className="all-cities">
          <div>
            <div>
              <img src={sunCloudy} alt="" />
              <div>
                <span>Manchester</span>
                <span>Cloudy. High: 11° Low: 18°</span>
              </div>
            </div>
            <div>
              <span>
                7 <sup>o</sup>
              </span>
            </div>
          </div>
          <div>
            <div>
              <img src={Rain} alt="" />
              <div>
                <span>Edinburgh</span>
                <span>Rain. High: 8° Low: 12°</span>
              </div>
            </div>
            <div>
              <span>
                19 <sup>o</sup>
              </span>
            </div>
          </div>
          <div>
            <div>
              <img src={Rain} alt="" />
              <div>
                <span>Bristol</span>
                <span>Snow. High: 2° Low: 8°</span>
              </div>
            </div>
            <div>
              <span>
                22 <sup>o</sup>
              </span>
            </div>
          </div>
          <div>
            <div>
              <img src={sunCloudy} alt="" />
              <div>
                <span>York</span>
                <span>Cloudy. High: 10° Low: 18°</span>
              </div>
            </div>
            <div>
              <span>
                20 <sup>o</sup>
              </span>
            </div>
          </div>
          <button>
            <span>See More</span>
            <ion-icon name="arrow-forward-outline"></ion-icon>
          </button>
        </div>
      </div>
    </section>
  );
};
export default DashBoard;

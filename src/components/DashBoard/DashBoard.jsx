import { useState, useEffect } from "react";
import "./DashBoard.css";
import sunCloudy from "../../assets/sun-cloudy.png";
import Rain from "../../assets/rain.png";
import PartlySunny from "../../assets/partly-sunny.png";
import SunWindy from "../../assets/sun-windy.png";
import Compass from "../../assets/compass.png";
import Drops from "../../assets/drops.png";
import Ultraviolet from "../../assets/ultraviolet.png";

const DashBoard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [otherCitiesData, setOtherCitiesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = "dddd398c7652c9c3398a81ee2313e509";

  // List of other Algerian cities to display
  const otherCities = ["Algiers", "Oran", "Constantine", "Annaba"];

  useEffect(() => {
    fetchAllWeatherData();
  }, []);

  const fetchAllWeatherData = async () => {
    try {
      setLoading(true);
      console.log("🌦️ Starting to fetch weather data...");

      // Fetch current weather for Sidi Bel Abbes
      console.log("📍 Fetching current weather for Sidi Bel Abbes...");
      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Sidi Bel Abbes,DZ&appid=${API_KEY}&units=metric`
      );

      console.log(
        "📊 Current weather response status:",
        currentWeatherResponse.status
      );

      if (currentWeatherResponse.ok) {
        const currentWeatherData = await currentWeatherResponse.json();
        console.log("✅ Current weather data received:", currentWeatherData);
        setWeatherData(currentWeatherData);
      } else {
        console.error(
          "❌ Current weather request failed:",
          currentWeatherResponse.status,
          currentWeatherResponse.statusText
        );
      }

      // Fetch 5-day forecast for Sidi Bel Abbes
      console.log("📅 Fetching 5-day forecast for Sidi Bel Abbes...");
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=Sidi Bel Abbes,DZ&appid=${API_KEY}&units=metric`
      );

      console.log("📊 Forecast response status:", forecastResponse.status);

      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        console.log("✅ Forecast data received:", forecastData);
        console.log("📋 Forecast list length:", forecastData.list.length);
        setForecastData(forecastData);
      } else {
        console.error(
          "❌ Forecast request failed:",
          forecastResponse.status,
          forecastResponse.statusText
        );
      }

      // Fetch weather for other Algerian cities
      console.log("🏙️ Fetching weather for other cities:", otherCities);
      const otherCitiesPromises = otherCities.map((city, index) => {
        console.log(`🌍 Fetching weather for ${city}...`);
        return fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city},DZ&appid=${API_KEY}&units=metric`
        )
          .then((response) => {
            console.log(`📊 ${city} response status:`, response.status);
            return response.ok ? response.json() : null;
          })
          .then((data) => {
            if (data) {
              console.log(`✅ ${city} data received:`, data);
            } else {
              console.warn(`⚠️ No data received for ${city}`);
            }
            return data;
          })
          .catch((error) => {
            console.error(`❌ Error fetching ${city}:`, error);
            return null;
          });
      });

      const otherCitiesResults = await Promise.all(otherCitiesPromises);
      const validCitiesData = otherCitiesResults.filter(
        (data) => data !== null
      );

      console.log("🏙️ Other cities results:", otherCitiesResults);
      console.log("✅ Valid cities data:", validCitiesData);
      console.log("📊 Number of valid cities:", validCitiesData.length);

      setOtherCitiesData(validCitiesData);
    } catch (error) {
      console.error("💥 Error fetching weather data:", error);
    } finally {
      setLoading(false);
      console.log("🏁 Weather data fetching completed");
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
  // Get next few days from forecast
  const getUpcomingForecast = () => {
    if (!forecastData) {
      console.log("⚠️ No forecast data available");
      return [null, null];
    }

    const today = new Date().getDate();
    const upcomingDays = [];
    const usedDates = new Set(); // Track which dates we've already used

    console.log("📅 Current date:", today);
    console.log("📋 Processing forecast data...");

    for (
      let i = 0;
      i < forecastData.list.length && upcomingDays.length < 2;
      i++
    ) {
      const forecastDate = new Date(forecastData.list[i].dt * 1000);
      const forecastDay = forecastDate.getDate();

      console.log(
        `📅 Forecast item ${i}: ${forecastDate.toLocaleDateString()}, Date: ${forecastDay}`
      );

      // Skip if it's today or if we've already used this date
      if (forecastDay !== today && !usedDates.has(forecastDay)) {
        console.log(
          `✅ Adding forecast for ${forecastDate.toLocaleDateString()}`
        );
        upcomingDays.push(forecastData.list[i]);
        usedDates.add(forecastDay); // Mark this date as used
      }
    }

    console.log("📊 Upcoming days found:", upcomingDays.length);
    console.log("🌤️ Upcoming forecast:", upcomingDays);

    return upcomingDays.length < 2
      ? [...upcomingDays, null, null].slice(0, 2)
      : upcomingDays;
  };

  const upcomingForecast = getUpcomingForecast();

  // Log state data when it changes
  useEffect(() => {
    console.log("🔄 Weather data state updated:", weatherData);
  }, [weatherData]);

  useEffect(() => {
    console.log("🔄 Forecast data state updated:", forecastData);
  }, [forecastData]);

  useEffect(() => {
    console.log("🔄 Other cities data state updated:", otherCitiesData);
  }, [otherCitiesData]);

  useEffect(() => {
    console.log("🔄 Loading state:", loading);
  }, [loading]);

  return (
    <section className="dashboard-section">
      <div className="home">
        <div className="feed-1">
          <div className="feeds">
            <img src={sunCloudy} alt="" />
            <div>
              <div>
                <span>
                  {weatherData
                    ? `${weatherData.name}, Algeria`
                    : "Sidi Bel Abbes, Algeria"}
                </span>
                <span>
                  {weatherData
                    ? weatherData.weather[0].description
                    : "Partly Cloud"}
                </span>
              </div>
              <div>
                <span>
                  {weatherData ? Math.round(weatherData.main.temp) : "28"}{" "}
                  <sup>o</sup>
                </span>
              </div>
            </div>
          </div>
          <div className="feed">
            <div>
              <div>
                <img src={PartlySunny} alt="" />
                <span>
                  {upcomingForecast[0]
                    ? Math.round(upcomingForecast[0].main.temp)
                    : "14"}{" "}
                  <sup>o</sup>
                </span>
              </div>
              <div>
                <span>
                  {upcomingForecast[0]
                    ? getDayName(upcomingForecast[0].dt_txt)
                    : "????"}
                </span>
                <span>
                  {upcomingForecast[0]
                    ? upcomingForecast[0].weather[0].main
                    : "Sun"}
                </span>
              </div>
            </div>
            <div>
              <div>
                <img src={SunWindy} alt="" />
                <span>
                  {upcomingForecast[1]
                    ? Math.round(upcomingForecast[1].main.temp)
                    : "16"}{" "}
                  <sup>o</sup>
                </span>
              </div>
              <div>
                <span>
                  {upcomingForecast[1]
                    ? getDayName(upcomingForecast[1].dt_txt)
                    : "?????"}
                </span>
                <span>
                  {upcomingForecast[1]
                    ? upcomingForecast[1].weather[0].main
                    : "Wind"}
                </span>
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
                  {weatherData ? Math.round(weatherData.main.feels_like) : "7"}{" "}
                  <sup>o</sup>
                </span>
              </div>
            </div>
            <div>
              <div>
                <img src={sunCloudy} alt="" />
                <div>
                  <span>Cloud</span>
                  <span>
                    {weatherData
                      ? weatherData.clouds.all > 50
                        ? "Heavy"
                        : "Normal"
                      : "Heavy"}
                  </span>
                </div>
              </div>
              <div>
                <span>
                  {weatherData ? weatherData.clouds.all : "18"} <sup>%</sup>
                </span>
              </div>
            </div>
            <div>
              <div>
                <img src={Rain} alt="" />
                <div>
                  <span>Rain</span>
                  <span>
                    {weatherData && weatherData.rain ? "Heavy" : "Normal"}
                  </span>
                </div>
              </div>
              <div>
                <span>
                  {weatherData && weatherData.rain
                    ? Math.round(weatherData.rain["1h"] || 0)
                    : "0"}{" "}
                  <sup>mm</sup>
                </span>
              </div>
            </div>
            <div>
              <div>
                <img src={Drops} alt="" />
                <div>
                  <span>Humidity</span>
                  <span>
                    {weatherData
                      ? weatherData.main.humidity > 60
                        ? "Heavy"
                        : "Normal"
                      : "Heavy"}
                  </span>
                </div>
              </div>
              <div>
                <span>
                  {weatherData ? weatherData.main.humidity : "65"} <sup>%</sup>
                </span>
              </div>
            </div>
            <div>
              <div>
                <img src={Ultraviolet} alt="" />
                <div>
                  <span>Pressure</span>
                  <span>
                    {weatherData
                      ? weatherData.main.pressure > 1013
                        ? "High"
                        : "Normal"
                      : "Heavy"}
                  </span>
                </div>
              </div>
              <div>
                <span>
                  {weatherData ? weatherData.main.pressure : "1013"}{" "}
                  <sup>hPa</sup>
                </span>
              </div>
            </div>
            <div>
              <div>
                <img src={PartlySunny} alt="" />
                <div>
                  <span>Wind</span>
                  <span>
                    {weatherData
                      ? weatherData.wind.speed > 5
                        ? "Strong"
                        : "Normal"
                      : "Normal"}
                  </span>
                </div>
              </div>
              <div>
                <span>
                  {weatherData
                    ? Math.round(weatherData.wind.speed * 3.6)
                    : "26"}{" "}
                  <sup>km/h</sup>
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
                <span>
                  {otherCitiesData[0] ? otherCitiesData[0].name : "Algiers"}
                </span>
                <span>
                  {otherCitiesData[0]
                    ? `${
                        otherCitiesData[0].weather[0].description
                      }. Temp: ${Math.round(otherCitiesData[0].main.temp)}°`
                    : "Cloudy. High: 11° Low: 18°"}
                </span>
              </div>
            </div>
            <div>
              <span>
                {otherCitiesData[0]
                  ? Math.round(otherCitiesData[0].main.temp)
                  : "7"}{" "}
                <sup>o</sup>
              </span>
            </div>
          </div>
          <div>
            <div>
              <img src={Rain} alt="" />
              <div>
                <span>
                  {otherCitiesData[1] ? otherCitiesData[1].name : "Oran"}
                </span>
                <span>
                  {otherCitiesData[1]
                    ? `${
                        otherCitiesData[1].weather[0].description
                      }. Temp: ${Math.round(otherCitiesData[1].main.temp)}°`
                    : "Rain. High: 8° Low: 12°"}
                </span>
              </div>
            </div>
            <div>
              <span>
                {otherCitiesData[1]
                  ? Math.round(otherCitiesData[1].main.temp)
                  : "19"}{" "}
                <sup>o</sup>
              </span>
            </div>
          </div>
          <div>
            <div>
              <img src={Rain} alt="" />
              <div>
                <span>
                  {otherCitiesData[2] ? otherCitiesData[2].name : "Constantine"}
                </span>
                <span>
                  {otherCitiesData[2]
                    ? `${
                        otherCitiesData[2].weather[0].description
                      }. Temp: ${Math.round(otherCitiesData[2].main.temp)}°`
                    : "Snow. High: 2° Low: 8°"}
                </span>
              </div>
            </div>
            <div>
              <span>
                {otherCitiesData[2]
                  ? Math.round(otherCitiesData[2].main.temp)
                  : "22"}{" "}
                <sup>o</sup>
              </span>
            </div>
          </div>
          <div>
            <div>
              <img src={sunCloudy} alt="" />
              <div>
                <span>
                  {otherCitiesData[3] ? otherCitiesData[3].name : "Annaba"}
                </span>
                <span>
                  {otherCitiesData[3]
                    ? `${
                        otherCitiesData[3].weather[0].description
                      }. Temp: ${Math.round(otherCitiesData[3].main.temp)}°`
                    : "Cloudy. High: 10° Low: 18°"}
                </span>
              </div>
            </div>
            <div>
              <span>
                {otherCitiesData[3]
                  ? Math.round(otherCitiesData[3].main.temp)
                  : "20"}{" "}
                <sup>o</sup>
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

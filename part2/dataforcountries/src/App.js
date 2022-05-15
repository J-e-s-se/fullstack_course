import { useEffect, useState } from "react";
import axios from "axios";

// CountryView Component
const CountryView = ({ country }) => {
  const [weatherData, setWeatherData] = useState({});
  const api_key = process.env.REACT_APP_API_KEY;
  const coordinates_endpoint = `http://api.openweathermap.org/geo/1.0/direct?q=${country.capital},${country.ccn3}&appid=${api_key}`;

  useState(() => {
    axios.get(coordinates_endpoint)
    .then((response) => {
      if (response.data[0] !== undefined) {
        const lat = response.data[0]["lat"];
        const lon = response.data[0]["lon"];
        const weather_endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;

        axios.get(weather_endpoint).then((response) => {
          setWeatherData(response.data);
        });
      }
    });
  }, []);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>

      <h3>languages: </h3>
      <ul>
        {country.languages && Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt="flag" />

      {Object.keys(weatherData).length !== 0 ? (
        <div>
          <h2>Weather in {country.capital}</h2>
          <p>temperature {(weatherData.main.temp - 273).toFixed(2)} Celsius</p>
          <img
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
          />
          <p>wind {weatherData.wind.speed} m/s</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

const App = () => {
  const [countriesData, setCountriesData] = useState([]);
  const [search, setSearch] = useState("");
  const [showView, setShowView] = useState({});

  // loads data using axios api
  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setCountriesData(response.data);
    });
  }, []);

  // updates search state on search input change
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  // filters searched countries from countriesData using search state
  const searchedCountries = countriesData.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  // updates showView states
  const toggleShow = (index) => {
    setShowView((oldShowView) => {
      const newShow = { ...oldShowView };
      const show = newShow[index];
      show ? (newShow[index] = false) : (newShow[index] = true);
      return newShow;
    });
  };

  return (
    <div>
      find countries
      <input value={search} onChange={handleSearch} />
      <div>
        {searchedCountries.length >= 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : (
          searchedCountries.length !== 1 &&
          searchedCountries.map((searchedCountry) => (
            <div key={searchedCountry.ccn3}>
              <p>
                {searchedCountry.name.common}
                <button onClick={(event) => toggleShow(searchedCountry.ccn3)}>
                  {showView[searchedCountry.ccn3] ? "hide" : "show"}
                </button>
              </p>
              {showView[searchedCountry.ccn3] ? (
                <CountryView country={searchedCountry} />
              ) : null}
            </div>
          ))
        )}

        {searchedCountries.length === 1 && (
          <CountryView country={searchedCountries[0]} />
        )}
      </div>
    </div>
  );
};

export default App;

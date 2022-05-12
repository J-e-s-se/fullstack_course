import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [countriesData, setCountriesData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log("effect");
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setCountriesData(response.data);
    });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const searchedCountries = countriesData.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div>
      find countries
      <input value={search} onChange={handleSearch} />
      <div>
        {(searchedCountries.length >= 10)? (
          <p>Too many matches, specify another filter</p>
        ) : (
          (searchedCountries.length !== 1) &&
          searchedCountries.map(searchedCountry => <p key={searchedCountry.ccn3}>{searchedCountry.name.common}</p>)
        )}

        {searchedCountries.length === 1 && 

          <div>
            <h1>{searchedCountries[0].name.common}</h1>
            <p>capital {searchedCountries[0].capital}</p>
            <p>area {searchedCountries[0].area}</p>

            <h3>languages: </h3>
            <ul>
              {Object.values(searchedCountries[0].languages).map(language => <li key={language}>{language}</li>)}
            </ul>
            <img src={searchedCountries[0].flags.png} alt="flag"/>
          </div>
        }
      </div>
      
    </div>
  );
};

export default App;

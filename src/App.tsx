
import { useState, useEffect } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import countriesJson from "./countries.json";

import TopPage from "./pages/TopPage";
import WorldPage from "./pages/WorldPage";
import './App.css';
import userEvent from "@testing-library/user-event";

type CountryDataType ={
  date: string,
  newConfirmed: number,
  totalConfirmed: number,
  newRecovered: number,
  totalRecovered: number
}

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [country, setCountry] = useState<string>("japan");
  const [countryData, setCountryData] = useState<CountryDataType>({
    date: "",
    newConfirmed: 0,
    totalConfirmed: 0,
    newRecovered: 0,
    totalRecovered: 0
  });
  const [allCountriesData, setAllCountriesData] = useState([]);
	


  useEffect(() => {
    const getCountryData = () => {
      setLoading(true);
      fetch(`https://api.covid19api.com/country/${country}`)
      .then(res => res.json())
      .then(data => {
        setCountryData({
          date: data[data.length - 1].Date,
          newConfirmed: data[data.length - 1].Confirmed - data[data.length - 2].Confirmed,
          totalConfirmed: data[data.length - 1].Confirmed,
          newRecovered: data[data.length - 1].Recovered - data[data.length - 2].Recovered,
          totalRecovered: data[data.length - 1].Recovered
        });
        setLoading(false);
      })
      .catch(err => alert("エラーが発生しました。ページをリロードしてください。"));
    }
    getCountryData();
  },[country])

  useEffect(() => {
      fetch("https://api.covid19api.com/summary")
      .then(res => res.json())
      .then(data => setAllcountriesData(data.Countries))
      .catch(err => alert("エラーが発生しました。ページをリロードしてください。"));
  },[]);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <TopPage countriesJson={countriesJson} setCountry={setCountry} countryData={countryData} loading={loading} />
        </Route>
        <Route exact path="/world">
          <WorldPage allCountriesData={allCountriesData} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;

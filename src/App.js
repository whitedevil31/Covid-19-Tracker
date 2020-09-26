import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import "./InfoBox.css";
import { sortData, prettyPrintStat } from "./util";
import InfoBox from "./InfoBox";
import Map from "./Map";
import "leaflet/dist/leaflet.css";
import "./App.css";
import Table from "./Table";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json()) // initially we have to load the data into our component
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () =>
      await fetch("https://disease.sh/v3/covid-19/countries") // for just fetching the list of country names from the api
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((content) => ({
            name: content.country,
            value: content.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setTableData(sortedData);
          setMapCountries(data);
        });

    getCountriesData();
  }, []);
  const onChangeCountry = async (event) => {
    const selectedCountry = event.target.value; // selecting a country from the list of contries

    const url =
      selectedCountry === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${selectedCountry}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(selectedCountry);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };
  console.log(countryInfo);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>

          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onChangeCountry}
            >
              <MenuItem value="worldwide" className="worldwide">
                Worldwide
              </MenuItem>
              {countries.map((data) => (
                <MenuItem value={data.value}>{data.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app___stats">
          <InfoBox
            isRed
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            total={prettyPrintStat(countryInfo.cases)}
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            total={prettyPrintStat(countryInfo.todayRecovered)}
            cases={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            active={casesType === "deaths"}
            total={prettyPrintStat(countryInfo.todayDeaths)}
            cases={prettyPrintStat(countryInfo.todayCases)}
          />
        </div>
        <Map
          countries={mapCountries}
          zoom={mapZoom}
          center={mapCenter}
          casesType={casesType}
        />
      </div>
      <div className="app__right">
        <Card>
          <h2 className="liveCases">Live cases </h2>
          <CardContent>
            <Table countries={tableData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;

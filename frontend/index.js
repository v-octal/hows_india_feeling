var map = L.map("map").setView([23, 81], 5);
api_url = "http://127.0.0.1:5000/";

function getColor(d) {
  return d > 0.7
    ? "#1a9850"
    : d > 0.4
    ? "#91cf60"
    : d > 0.1
    ? "#d9ef8b"
    : d > -0.1
    ? "#ffffbf"
    : d > -0.4
    ? "#fee08b"
    : d > -0.7
    ? "#fc8d59"
    : "#d73027";
}

function style(feature) {
  return {
    fillColor: getColor(feature.properties.density),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7
  };
}

async function getSentimentData() {
  const response = await fetch(api_url);
  data = await response.json();
  setStateSentimentDensity(data);
}

function setStateSentimentDensity(data) {
  for (i = 0; i < statesGeoJson["features"].length; i++) {
    state_name = statesGeoJson["features"][i]["properties"]["name"];
    statesGeoJson["features"][i]["properties"]["density"] = data[state_name][0];
  }

  L.geoJson(statesGeoJson, { style: style }).addTo(map);
}

L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 7,
  minZoom: 5
}).addTo(map);

getSentimentData();
L.geoJson(statesGeoJson).addTo(map);

var map = L.map("map").setView([23, 81], 5);
api_url = "http://127.0.0.1:5000/";
var geojson;

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

var info = L.control();

info.onAdd = function(map) {
  this._div = L.DomUtil.create("div", "info");
  this.update();
  return this._div;
};

info.update = function(props) {
  if (props) {
    total = props.pos_count + props.neg_count + props.neu_count;
  }
  this._div.innerHTML =
    "<h4>India Tweet Sentiment Overview</h4>" +
    (props
      ? "<b>" +
        props.name +
        "</b><br />" +
        "Positive: " +
        ((props.pos_count * 100) / total).toFixed(2) +
        "% <br />" +
        "Neutral : " +
        ((props.neu_count * 100) / total).toFixed(2) +
        "% <br />" +
        "Negative: " +
        ((props.neg_count * 100) / total).toFixed(2) +
        "% <br />"
      : "Hover over a state");
};

info.addTo(map);

var legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend"),
    grades = [-0.7, -0.4, -0.1, 0.1, 0.4, 0.7, 1],
    labels = [];

  for (var i = 0; i < grades.length; i++) {
    label_text = "";
    switch (i) {
      case 0:
        label_text = "Negative";
        break;
      case Math.floor(grades.length / 2):
        label_text = "Neutral";
        break;
      case grades.length - 1:
        label_text = "Positive";
        break;
      default:
        break;
    }
    div.innerHTML +=
      '<i style="background:' +
      getColor(grades[i]) +
      '"></i> ' +
      label_text +
      "<br>";
  }

  return div;
};

legend.addTo(map);

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

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
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
    statesGeoJson["features"][i]["properties"]["pos_count"] =
      data[state_name][1];
    statesGeoJson["features"][i]["properties"]["neu_count"] =
      data[state_name][2];
    statesGeoJson["features"][i]["properties"]["neg_count"] =
      data[state_name][3];
  }

  geojson = L.geoJson(statesGeoJson, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);
}

L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 7,
  minZoom: 5
}).addTo(map);

getSentimentData();

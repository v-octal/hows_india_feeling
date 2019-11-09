var map = L.map("map").setView([23, 81], 5);

L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 7,
  minZoom: 5
}).addTo(map);

L.geoJson(statesGeoJson).addTo(map);

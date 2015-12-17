// Reference to my Firebase
var myFirebaseRef = new Firebase('https://torrid-inferno-1243.firebaseio.com/');

console.log('%c⚛ Projection Mapping Tool: Hello geohacker! ⚛', 'font-family:monospace;font-size:16px;color:darkblue;');

// Leaflet Map Init
function initMap() {
  var center = [35.8, 139];
  var zoom = 4;
  var map = L.map('l-map', { zoomControl: false, attributionControl: false }).setView(center, zoom);
  L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    id: 'osm'
  }).addTo(map);

  map.on('moveend', function(e) {
    console.log(map.getCenter(), map.getZoom());
    var currentCenter = map.getCenter();
    var currentZoom = map.getZoom();
    myFirebaseRef.set({
      title: 'sync map!',
      author: 'ynunokawa',
      map: {
        center: [currentCenter.lat, currentCenter.lng],
        zoom: currentZoom
      }
    });
  });

  /*myFirebaseRef.child('map/center').on('value', function(snapshot) {
    center = snapshot.val();
    map1.setView(center, zoom);
    map2.setView(center, zoom);
    map3.setView(center, zoom);
  });
  myFirebaseRef.child('map/zoom').on('value', function(snapshot) {
    zoom = snapshot.val();
    map1.setView(center, zoom);
    map2.setView(center, zoom);
    map3.setView(center, zoom);
  });*/
}
initMap();

// Reference to my Firebase
var myFirebaseRef = new Firebase('https://torrid-inferno-1243.firebaseio.com/');

// Grobal
var map;

console.log('%c⚛ Projection Mapping Tool: Hello geohacker! ⚛', 'font-family:monospace;font-size:16px;color:darkblue;');

// Button event listner for highlight
$('.button').on('click', function(e) {
  console.log(e.target.id);
  var button = $('#' + e.target.id);
  button.css('background', 'rgba(255,255,255,.75)');
  setTimeout(function() {
    button.css('background', 'rgba(0,0,0,.75)');
  }, 200);
});

// Create GeoJSON layer and add into map
function createGeoJSONLayer(url) {
  var markerIcon = L.divIcon({
    className: 'svg-marker-icon',
    html: '<svg width="64px" height="64px" viewBox="-20 -20 64 64"><g><circle class="circles" opacity="0.4" r="6" transform="translate(0,0)"></circle></g></svg>'
  });
  var pathStyle = {
    color: '#ff6500',
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.35,
    fillColor: '#ff6500'
  };
  $.getJSON(url, function(data) {
    var geojson = L.geoJson(data, {
      onEachFeature: function(feature, layer) {
        console.log(layer.feature.geometry.type);
        if(layer.feature.geometry.type === 'Polygon' || layer.feature.geometry.type === 'MultiPolygon' || layer.feature.geometry.type === 'Polyline') {
          layer.setStyle(pathStyle);
        }
        else if(layer.feature.geometry.type === 'Point' || layer.feature.geometry.type === 'MultiPoint') {
          layer.setIcon(markerIcon);
        }
        else {
          return false;
        }
      }
    });
    geojson.addTo(map);
  });
}

// Init
function initMap() {
  var dataUrl = 'https://muxlab.github.io/map-effects-100/data/japan.geojson';
  var center = [35.8, 139];
  var zoom = 4;
  map = L.map('l-map', { zoomControl: false, attributionControl: false }).setView(center, zoom);
  L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    id: 'osm'
  }).addTo(map);

  // Sync map position
  map.on('moveend', function(e) {
    console.log(map.getCenter(), map.getZoom());
    var currentCenter = map.getCenter();
    var currentZoom = map.getZoom();
    myFirebaseRef.set({
      map: {
        center: [currentCenter.lat, currentCenter.lng],
        zoom: currentZoom
      },
      flash1: false,
      flash2: false,
      dataUrl: dataUrl
    });
  });

  // Flash 1
  $('#flash1').on('click', function(e) {
    var currentCenter = map.getCenter();
    var currentZoom = map.getZoom();
    myFirebaseRef.set({
      map: {
        center: [currentCenter.lat, currentCenter.lng],
        zoom: currentZoom
      },
      flash1: true,
      flash2: false,
      dataUrl: dataUrl
    });
    myFirebaseRef.set({
      map: {
        center: [currentCenter.lat, currentCenter.lng],
        zoom: currentZoom
      },
      flash1: false,
      flash2: false,
      dataUrl: dataUrl
    });
  });

  // Flash 2
  $('#flash2').on('click', function(e) {
    var currentCenter = map.getCenter();
    var currentZoom = map.getZoom();
    myFirebaseRef.set({
      map: {
        center: [currentCenter.lat, currentCenter.lng],
        zoom: currentZoom
      },
      flash1: false,
      flash2: true,
      dataUrl: dataUrl
    });
    myFirebaseRef.set({
      map: {
        center: [currentCenter.lat, currentCenter.lng],
        zoom: currentZoom
      },
      flash1: false,
      flash2: false,
      dataUrl: dataUrl
    });
  });

  // Data import
  $('#import').on('click', function(e) {
    var currentCenter = map.getCenter();
    var currentZoom = map.getZoom();
    dataUrl = $('#geojson-url').val();
    createGeoJSONLayer(dataUrl);
    myFirebaseRef.set({
      map: {
        center: [currentCenter.lat, currentCenter.lng],
        zoom: currentZoom
      },
      flash1: false,
      flash2: false,
      dataUrl: dataUrl
    });
  });
}
initMap();

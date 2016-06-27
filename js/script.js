const fromBlock = document.getElementById('fromBlock');
const submitButton = document.getElementById('submitButton');
const from = document.getElementById('form');
const to = document.getElementById('to');
const iconDown = document.getElementById('on-icon-down-big');
const errors = {
  1: 'Permission denied',
  2: 'Position unavailable',
  3: 'Request timeout',
};
const GeoJSON = [
  {
    type: 'Feature',
    properties: {
      name: 'start point',
      type: 'start',
      popupContent: 'Some popup!',
    },
    geometry: {
      type: 'Point',
      coordinates: [23.79417658, 53.6729683],
    } },
  {
    type: 'Feature',
    properties: {
      name: 'bus stop',
      type: 'bus_stop',
      popupContent: 'Some popup!',
    },
    geometry: {
      type: 'Point',
      coordinates: [23.78851175, 53.66706981],
    },
  },
  {
    type: 'Feature',
    properties: {
      name: 'bus stop',
      type: 'bus_stop',
      popupContent: 'Some popup!',
    },
    geometry: {
      type: 'Point',
      coordinates: [23.78439188, 53.66429825],
    },
  },
  {
    type: 'Feature',
    properties: {
      name: 'bus stop',
      type: 'bus_stop',
      popupContent: 'Some popup!',
    },
    geometry: {
      type: 'Point',
      coordinates: [23.78190279, 53.65911062],
    },
  },
  {
    type: 'Feature',
    properties: {
      name: 'end point',
      type: 'end',
      popupContent: 'Some popup!',
    },
    geometry: {
      type: 'Point',
      coordinates: [23.78194571, 53.65791534],
    },
  },
  {
    type: 'Feature',
    properties: {
      name: 'Lines',
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [23.79417658, 53.6729683],
        [23.78851175, 53.66706981],
        [23.78439188, 53.66429825],
        [23.78190279, 53.65911062],
        [23.78194571, 53.65791534],
      ],
    },
  },
];
const startIcon = L.icon.mapkey(
  {
    icon: 'avatar',
    color: '#1B8717',
    background: 'white',
    size: 35,
  });
const endIcon = L.icon.mapkey(
  {
    icon: 'golf',
    color: 'red',
    background: 'white',
    size: 35,
  });
const busIcon = L.icon.mapkey(
  {
    icon: 'bus',
    color: 'white',
    background: '#221961',
    size: 30,
  });

let fromFlag = false;
let requestFlag = false;
let checkFlag = false;
let latitude;
let longitude;
let accuracy;
let json;
let map;

fromBlock.classList.add('animated', 'bounceInLeft');
fromBlock.style.display = 'none';

function createRequest(data) {
  L.geoJson(GeoJSON, {
    pointToLayer: (feature, latlng) => {
      switch (feature.properties.type) {
        case 'start': return L.marker(latlng, { icon: startIcon });
        case 'end': return L.marker(latlng, { icon: endIcon });
        case 'bus_stop': return L.marker(latlng, { icon: busIcon });
        default: return L.marker(latlng);
      }
    },
    style: (feature) => {
      switch (feature.properties.name) {
        case 'Lines': return { color: 'black', weight: 5, opacity: 0.65 };
        default: return false;
      }
    },
  }).addTo(map);

  console.log(data);
}

function initMap() {
  map = L.map('map-body', {
    scrollWheelZoom: true }
  ).setView([53.68583, 23.83812], 13);

  L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a> contributors | Tiles Courtesy of <a href="http://www.mapquest.com/" title="MapQuest" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" width="16" height="16">',
    subdomains: ['otile1', 'otile2', 'otile3', 'otile4'] }
  ).addTo(map);
}

function onSuccessCallback(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  accuracy = position.coords.accuracy;

  json = {
    location: {
      lat: latitude,
      lon: longitude,
      accuracy,
    },
    to: $('#to').val(),
  };
  if (!map) {
    initMap();
  }
  createRequest(json);

  iconDown.style.display = 'block';
}

function resizeSubmitButton() {
  fromBlock.style.display = 'block';
  const width = window.innerWidth;
  if (width < 768) {
    fromBlock.style.marginBottom = '10px';
  }
  if (width >= 768) {
    submitButton.style.marginTop = '10px';
    submitButton.style.marginLeft = '0px';
    document.getElementById('button').style.width = '97.5%';
    fromBlock.style.marginRight = '5px';
  }
}

function onErrorCallback(error) {
  console.log(errors[error.code]);
  fromBlock.style.display = 'block';
  resizeSubmitButton();

  fromFlag = true;
  requestFlag = true;
}

function geoFindMe() {
  const timeoutVal = 20 * 1000;

  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
  } else {
    navigator.geolocation.getCurrentPosition(onSuccessCallback, onErrorCallback,
      { enableHighAccuracy: true, timeout: timeoutVal });
  }
}

function checkValues() {
  const fromText = $('#from').val();
  const toText = $('#to').val();

  if (fromFlag) {
    if (fromText.length !== 0 && toText.length !== 0) {
      $('#submitButton').removeAttr('disabled');
      checkFlag = false;
    } else {
      $('#submitButton').attr('disabled', 'disabled');
      checkFlag = true;
    }
  } else {
    if (toText.length !== 0) {
      $('#submitButton').removeAttr('disabled');
      checkFlag = false;
    } else {
      $('#submitButton').attr('disabled', 'disabled');
      checkFlag = true;
    }
  }
}

function searchRoutes() {
  checkValues();
  geoFindMe();

  if (requestFlag && !checkFlag) {
    json = {
      from: $('#from').val(),
      to: $('#to').val(),
    };
    console.log(json);

    if (!map) {
      initMap();
    }

    createRequest(json);
    iconDown.style.display = 'block';
  }
}

from.onkeyup = checkValues;
to.onkeyup = checkValues;
submitButton.onclick = searchRoutes;

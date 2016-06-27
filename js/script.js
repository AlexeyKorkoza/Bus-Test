import GeoJson from '../models/GeoJson';
import { startIcon, endIcon, busIcon } from '../models/Icons';

const fromBlock = document.getElementById('fromBlock');
const submitButton = document.getElementById('submitButton');
const from = document.getElementById('form');
const to = document.getElementById('to');
const iconDown = document.getElementById('on-icon-down-big');
const outBlock = document.getElementById('out-container');
const errors = {
  1: 'Permission denied',
  2: 'Position unavailable',
  3: 'Request timeout',
};

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
outBlock.classList.add('animated', 'zoomIn');
outBlock.style.display = 'none';
submitButton.classList.add('animated', 'fadeInRight');
submitButton.style.display = 'none';

function createRequest(data) {
  submitButton.style.display = 'none';
  outBlock.style.display = 'block';

  L.geoJson(GeoJson, {
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
      submitButton.style.display = 'block';
      checkFlag = false;
    } else {
      submitButton.style.display = 'none';
      checkFlag = true;
    }
  } else {
    if (toText.length !== 0) {
      submitButton.style.display = 'block';
      checkFlag = false;
    } else {
      submitButton.style.display = 'none';
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

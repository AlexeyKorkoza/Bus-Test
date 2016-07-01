import GeoJson from '../models/GeoJson';
import { startIcon, endIcon, busIcon } from '../models/Icons';

const fromBlock = document.getElementById('fromBlock');
const submitButton = document.getElementById('submitButton');
const watchOnMapButton = document.getElementById('watchOnMapButton');
const watchOnFormButton = document.getElementById('watchOnFormButton');
const from = document.getElementById('from');
const to = document.getElementById('to');
const formContainer = document.getElementById('form');
const mapContainer = document.getElementById('map');
const outContainer = document.getElementById('out');
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

fromBlock.style.display = 'none';
outContainer.classList.add('animated', 'zoomIn');
outContainer.style.display = 'none';
submitButton.classList.add('animated', 'fadeInRight');

function initMap() {
  map = L.map('map-body', {
    scrollWheelZoom: true }
  ).setView([53.68583, 23.83812], 13);

  L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a> contributors | Tiles Courtesy of <a href="http://www.mapquest.com/" title="MapQuest" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" width="16" height="16">',
    subdomains: ['otile1', 'otile2', 'otile3', 'otile4'] }
  ).addTo(map);
}

function createRequest(data) {
  submitButton.style.display = 'none';
  outContainer.style.display = 'block';

  if (map === undefined) {
    initMap();
  }

  L.geoJson(GeoJson, {
    pointToLayer: (feature, latlng) => {
      switch (feature.properties.type) {
        case 'start':
          {
            map.setView(latlng, 14);
            return L.marker(latlng, { icon: startIcon });
          }
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

function showAlert() {
  $('#alertMessage').show('slow');
  setTimeout(() => { $('#alertMessage').hide('slow'); }, 2000);
}

function onSuccessCallback(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  accuracy = position.coords.accuracy;

  if (checkFlag) {
    json = {
      location: {
        lat: latitude,
        lon: longitude,
        accuracy,
      },
      to: $('#to').val(),
    };

    createRequest(json);
  } else {
    showAlert();
  }
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
  fromBlock.classList.add('animated', 'bounceInLeft');
  fromBlock.style.display = 'block';
  fromBlock.classList.remove('animated');
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
      submitButton.style.background = 'green';
      checkFlag = true;
    } else {
      checkFlag = false;
      submitButton.style.background = 'red';
    }
  } else {
    if (toText.length !== 0) {
      submitButton.style.display = 'block';
      submitButton.style.background = 'green';
      checkFlag = true;
    } else {
      checkFlag = false;
      submitButton.style.background = 'red';
    }
  }
}

function searchRoutes() {
  checkValues();
  geoFindMe();

  if (requestFlag) {
    if (checkFlag) {
      json = {
        from: $('#from').val(),
        to: $('#to').val(),
      };
      createRequest(json);
    } else {
      showAlert();
    }
  }
}

function watchMapContainer() {
  formContainer.style.display = 'none';
  mapContainer.style.display = 'block';
}

function watchFormContainer() {
  formContainer.style.display = 'block';
  mapContainer.style.display = 'none';
}

from.onkeydown = checkValues;
to.onkeydown = checkValues;
submitButton.onclick = searchRoutes;
watchOnMapButton.onclick = watchMapContainer;
watchOnFormButton.onclick = watchFormContainer;
submitButton.onkeydown = checkValues;

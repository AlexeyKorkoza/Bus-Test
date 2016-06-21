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
const xhr = new XMLHttpRequest();

let fromFlag = false;
let requestFlag = false;
let checkFlag = false;
let latitude;
let longitude;
let accuracy;
let json;

fromBlock.classList.add('animated', 'bounceInLeft');
fromBlock.style.display = 'none';

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
  iconDown.style.display = 'block';

  xhr.open('POST', '/url', true);
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  console.log(json);
}

function resizeSubmitButton() {
  fromBlock.style.display = 'block';
  const width = window.innerWidth;
  if (width < 768) {
    fromBlock.style.marginBottom = '10px';
  }
  if (width >= 768) {
    submitButton.style.marginTop = '10px';
    submitButton.style.width = '98.5%';
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

from.onkeyup = checkValues;
to.onkeyup = checkValues;

function searchRoutes() {
  checkValues();
  geoFindMe();

  if (requestFlag && !checkFlag) {
    json = {
      from: $('#from').val(),
      to: $('#to').val(),
    };
    console.log(json);
    xhr.open('POST', '/url', true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  }
}

submitButton.onclick = searchRoutes;

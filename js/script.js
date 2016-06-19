const output = document.getElementById('out');
const el = document.getElementById('fromBlock');
const errors = {
  1: 'Permission denied',
  2: 'Position unavailable',
  3: 'Request timeout',
};
let fromFlag = false;
let latitude;
let longitude;
let accuracy ;

function onSuccessCallback(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  accuracy = position.coords.accuracy;


  output.innerHTML = '<p>Latitude is ' + latitude + '° <br>' +
      'Longitude is ' + longitude + '°<br>Accuracy: ' + accuracy + '</p>';
}

function onErrorCallback() {
  output.innerHTML = errors[onErrorCallback.code];
  resizeSubmitButton();
  fromFlag = true;
}

function resizeSubmitButton(){
  el.style.display = 'block';
  var width = window.innerWidth;
  if(width < 768){
  el.style.marginBottom = "10px";
  }
  if(width >= 768){
  document.getElementById('submitButton').style.marginTop = "10px";
  document.getElementById('submitButton').style.width = "98.5%";
  }
}

function geoFindMe() {
  const timeoutVal = 20 * 1000;

  if (!navigator.geolocation) {
    output.innerHTML = '<p>Geolocation is not supported by your browser</p>';
  } else {
    navigator.geolocation.getCurrentPosition(onSuccessCallback, onErrorCallback,
    { enableHighAccuracy: true, timeout: timeoutVal });
  }
}

$(document).ready(() => {
  document.getElementById('fromBlock').classList.add('animated', 'bounceInLeft');
  document.getElementById('fromBlock').style.display = 'none';
  geoFindMe();
  output.innerHTML = '<p>Locating…</p>';
});

function searchRoutes() {
  const xhr = new XMLHttpRequest();
  let json;
  
  if(fromFlag) {
    json ={
      'from' : $('#from').val(),
      'to' : $('#to').val()
    };
  } else {
    json = {
      'location' : {
        'lat' : latitude,
        'lon' : longitude,
        'accuracy' : accuracy
      },
      'to': $('#to').val()
    };
  }
  xhr.open('POSt', '/url', true);
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  console.log(json);
  // xhr.send(json);
}

function checkValues() {
  const fromBlock = $('#from').val();
  const toBlock = $('#to').val();

  if (fromFlag) {
    if (fromBlock.length !== 0 && toBlock.length !== 0) {
      $('#submitButton').removeAttr('disabled');
    } else {
      $('#submitButton').attr('disabled', 'disabled');
    }
  } else {
    if (toBlock.length !== 0) {
      $('#submitButton').removeAttr('disabled');
    } else {
      $('#submitButton').attr('disabled', 'disabled');
    }
  }

  // document.getElementById('submitButton')
  //     .disabled = fromBlock.value || toBlock.value ? false : 'disabled';
}
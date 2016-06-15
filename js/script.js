$(document).ready(function () {

    document.getElementById('fromBlock').classList.add('animated','bounceInLeft');
    document.getElementById('fromBlock').style.display = 'none';

    geoFindMe();
});

function geoFindMe() {
    var output = document.getElementById("out");
    var el = document.getElementById('fromBlock');
    var timeoutVal = 10 * 1000 * 1000;

    if (!navigator.geolocation) {
        output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
        return;
    }else{
        navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 });
    }

    function success(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var accuracy = position.coords.accuracy;


        output.innerHTML = '<p>Latitude is ' + latitude + '° <br>' +
            'Longitude is ' + longitude + '°<br>Accuracy: '+ accuracy  +
        '</p>';
    }

    function error(error) {
        var errors = {
            1: 'Permission denied',
            2: 'Position unavailable',
            3: 'Request timeout'
        };

        output.innerHTML = errors[error.code];
        el.style.display = 'block';

    }

    output.innerHTML = "<p>Locating…</p>";




}

function searchRoutes(){
    
}

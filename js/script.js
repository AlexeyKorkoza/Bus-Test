$(document).ready(function () {

    $('#geo').each(function () {
        animationClick(this, 'tada');
    });
    document.getElementById('fromBlock').classList.add('animated','bounceInLeft');
    document.getElementById('fromBlock').style.display = 'none'
});

function animationClick(element, animation) {
    element = $(element);
    element.click(
        function () {
            element.addClass('animated ' + animation);
            //wait for animation to finish before removing classes
            window.setTimeout(function () {
                element.removeClass('animated ' + animation);
            }, 2000);

        });
}

function geoFindMe() {
    var output = document.getElementById("out");
    var el = document.getElementById('fromBlock');

    if (!navigator.geolocation) {
        output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
        return;
    }

    function success(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        el.style.display = 'none';

        output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';
    };

    function error() {
        output.innerHTML = "Unable to retrieve your location";
        el.style.display = 'block';

    };

    output.innerHTML = "<p>Locating…</p>";

    navigator.geolocation.getCurrentPosition(success, error);
}


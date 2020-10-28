var a = function () {
    console.log("TEST !");
    var h = 1;
};
function showPosition(position) {
    console.log(position.coords, "Latitude: " +
        position.coords.latitude +
        "<br>Longitude: " +
        position.coords.longitude);
}
if (navigator.geolocation) {
    setInterval(function () {
        navigator.geolocation.getCurrentPosition(showPosition);
    }, 1000);
}
// export { a };
//# sourceMappingURL=tracker.js.map
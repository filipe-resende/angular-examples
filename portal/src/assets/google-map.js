function initMap() {
  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById("google-map"), {
    center: {
      latitude: -34.397,
      longitude: 150.644,
    },
    zoom: 8,
  });
}

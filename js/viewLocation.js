/**
 * Created by Spyr1014 on 15/05/2016.
 */
var map;
var geocoder;
var LOCATIONINDEX= localStorage.getItem(LOCATION_IDX);
var LOCATION = locationsList.locationAtIndex(LOCATIONINDEX);
if (!LOCATION && LOCATIONINDEX !== "current") location.href = "index.html"; //Redirect if no location found.

function initWeather(){
  // Initialise the map
  (function() {
    var mapScript = document.createElement("script");
    var googleMapsApi = "https://maps.googleapis.com/maps/api/js?key=" + MAPS_API_KEY + "&callback=initMap";
    mapScript.setAttribute("id", "scriptMap");
    mapScript.setAttribute("async", "");
    mapScript.setAttribute("defer", "");
    mapScript.setAttribute("src", googleMapsApi);
    document.body.appendChild(mapScript);
  })();


  // Load the location information or current location information
  if (LOCATION) {
    document.getElementById("locationName").innerHTML = LOCATION.getName();
    locationsList.getWeatherAtIndexForDate(LOCATIONINDEX, new Date(), populateWeatherValue);
  } else {
    var geoOptions = {
      timeout: 10 * 1000,
      maximumAge: 5 * 60 * 1000
    };
    document.getElementById("trash").style.display = "none";
    document.getElementById("slider").style.display = "none";
    if ("geolocation" in navigator) {
      document.getElementById("locationName").innerHTML = "Current Location";
      navigator.geolocation.watchPosition(function(position) {
        locationsList.getCurrentWeather(position.coords.latitude, position.coords.longitude, populateWeatherValue);
      }, function(error) {
        var errorString;
        switch (error.code){
          case 0:
            errorString = "unknown error";
            break;
          case 1:
            errorString = "permission denied";
            break;
          case 2:
            errorString = "position unavailable";
            break;
          case 3:
            errorString = "timed out";
            break;
        }
        alert("Error occurred. Error code: " + errorString);
      }, geoOptions);
    } else {
      /* geolocation IS NOT available */
    }
  }

}

function populateWeatherValue(index, data){
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];
  var lat = data.latitude;
  var lng = data.longitude;
  var data = data.daily.data[0];
  var textString, precipIntensity;
  document.getElementById("summary").innerText = data.summary;
  textString = data.temperatureMin + " - " + data.temperatureMax + "\u2103";
  document.getElementById("temperature").innerText = textString;

  date = new Date(data.time * 1000);
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var dateString = day + ' ' + monthNames[monthIndex] + ' ' + year;
  document.getElementById("dateTitle").innerText = "Weather Report for "+ dateString;
  switch (true) {
    case (data.precipIntensity <= 0.002):
      precipIntensity = "very light";
      break;
    case (data.precipIntensity <= 0.017):
      precipIntensity = "light";
      break;
    case (data.precipIntensity <= 0.2):
      precipIntensity = "moderate";
      break;
    default:
      precipIntensity = "heavy";
      break;
  }

  textString = (data.precipProbability * 100) + "% chance of " + precipIntensity + " " + data.precipType + ".";
  document.getElementById("precip").innerText = textString;
  document.getElementById("wind").innerText = data.windSpeed + "km/h winds";
  document.getElementById("humidity").innerText = (data.humidity * 100) + "% humidity";


  // Hide Loading and Show content
  document.getElementById("hide").style.display = "block";
  document.getElementById("loading").style.display = "none";

  // Update the map
  setTimeout(moveMap.bind(null, lat, lng), 500);
}


function initMap(){
  console.log("initiating map");
  var mapDiv = document.getElementById("map");
  geocoder = new google.maps.Geocoder();
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 29.532804, lng: -55.491477},
    zoom: 13
  });
  mapDiv.style.width = "100%";
  mapDiv.style.height = "400px";
  document.getElementById("scriptMap").remove(); // Cleans up the script call
}

function moveMap(latitude, longitude){
  console.log("map move");
  var location = {lat: latitude, lng: longitude};
  map.setCenter(location);
  var marker = new google.maps.Marker({
    map: map,
    position: location
  });
}

document.getElementById("slider").addEventListener("input", function(){
  var value = document.getElementById("slider").value;
  value = 30 - (value % 31);
  var date = new Date(new Date().setDate(new Date().getDate()-value));
  locationsList.getWeatherAtIndexForDate(LOCATIONINDEX, date, populateWeatherValue);
});

function deleteLocation(){
  if (window.confirm("Are you sure you want to delete " + LOCATION.getName() + "?")){
    locationsList.removeLocationAtIndex(LOCATIONINDEX);
    saveLocations();
    return true;
  }
  return false;
}
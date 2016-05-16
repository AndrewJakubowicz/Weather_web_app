/**
 * Created by Spyr1014 on 15/05/2016.
 */

var map;
var geocoder;
var savedAddress;

// Function called by google maps script api callback.
function initMap() {
  var mapDiv = document.getElementById("map");
  geocoder = new google.maps.Geocoder();
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: -37, lng: 145},
    zoom: 15
  });
  mapDiv.style.width = "100%";
  document.getElementById("scriptMap").remove(); // Cleans up the script call
}

// Geocode the address inputted by the user
function geocodeAddress(){
  var addressInput = document.getElementById("addressInput").value;

  geocoder.geocode({'address': addressInput}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK){
      savedAddress = results[0].geometry.location;
      console.log(savedAddress);
      map.setCenter(savedAddress);
      var marker = new google.maps.Marker({
        map: map,
        position: savedAddress
      });
      document.getElementById("error").innerText = "";
    } else {
      document.getElementById("error").innerText = "Error finding Address";
      savedAddress = "";
    }
  })
}

// Adds input event listener to addressInput, allowing visual location as it is typed in.
document.getElementById("addressInput").addEventListener("input", geocodeAddress);

// Function that runs on page load
function initPage() {
  // Create the google map
  (function() {
    var mapScript = document.createElement("script");
    var googleMapsApi = "https://maps.googleapis.com/maps/api/js?key=" + MAPS_API_KEY + "&callback=initMap";
    mapScript.setAttribute("id", "scriptMap");
    mapScript.setAttribute("async", "");
    mapScript.setAttribute("defer", "");
    mapScript.setAttribute("src", googleMapsApi);
    document.body.appendChild(mapScript);
  })();
}

function validateSubmit() {
  var name;
  if (savedAddress) {
    name = document.getElementById("nameInput").value;
    if (!name) name = document.getElementById("addressInput").value;
    locationsList.addLocation(savedAddress.lat(), savedAddress.lng(), name);
    saveLocations();
    return true;
  } else {
    alert("Error: Can't find Address. Please check your address is correct");
    return false
  }
}

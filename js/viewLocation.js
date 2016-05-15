/**
 * Created by Spyr1014 on 15/05/2016.
 */

var LOCATIONINDEX= localStorage.getItem(LOCATION_IDX);
var LOCATION = locationsList.locationAtIndex(LOCATIONINDEX);
if (!LOCATION) location.href = "index.html"; //Redirect if no location found.

function initWeather(){
  document.getElementById("locationName").innerHTML = LOCATION.getName();
  locationsList.getWeatherAtIndexForDate(LOCATIONINDEX, new Date(), populateWeatherValue);
}

function populateWeatherValue(index, data){
  var data = data.daily.data[0];
  document.getElementById("summary").innerText = data.summary;
  document.getElementById("summary").innerText = data.summary;

}


function deleteLocation(){
  if (window.confirm("Are you sure you want to delete " + LOCATION.getName() + "?")){
    locationsList.removeLocationAtIndex(LOCATIONINDEX);
    saveLocations();
    return true;
  }
  return false;
}
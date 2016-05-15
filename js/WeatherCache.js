/**
 * Created by Spyr1014 on 15/05/2016.
 */

var STORAGE_KEY = "weather_obj";
var LOCATION_IDX;

// Code that needs to execute on the load of every page.
// --------------------------------------------------- //

var locationsList = new LocationsListCache();
loadLocations();

// --------------------------------------------------- //

Date.prototype.dateString = function () {
  function pad (value) {
    return ("0" + value).slice(-2);
  }

  return this.getFullYear() + "-" +
    pad(this.getMonth() + 1) + "-" +
    pad(this.getDate());
};

// Date format required by forecast.io api.
// If the time is always represented as midday
// time zone errors are avoided.
Date.prototype.apiDateString = function() {
  return this.dateString() + "T12:00:00";
};

function Location (nickname, lat, lngtitude, forecast){
  var name = nickname;
  var latitude = lat;
  var longitude = lngtitude;
  var forecasts = forecast;
  if (!forecasts) forecasts = {};

  this.getName = function() {  return name;  };
  this.getLatitude = function() {  return latitude  };
  this.getLongitude = function() {  return longitude  };

  // Gets the forecast for a specific date.
  this.getForecast = function(string) {
    //TODO: Fill in function
  };

  this.toJSON = function() {
    return {
      name: name,
      latitude: latitude,
      longitude: longitude,
      forecasts: forecasts
    };
  };


  this.initialiseFromPDO = function(data) {
    name = data.name;
    latitude = data.latitude;
    longitude = data.longitude;
    forecasts = data.forecasts;
  };
}

function LocationsListCache(){
  var locations = [];
  // TODO: Work out callbacks
  this.locations = function() {
    return locations;
  };

  this.length = function(){
    return locations.length;
  };

  this.locationAtIndex = function(index) {
    return locations[index];
  };

  this.addLocation = function(latitude, longitude, name){
    return locations.push(new Location(name, latitude, longitude)) - 1;
  };

  this.removeLocationAtIndex = function(index) {
    locations.splice(index, 1);
  };

  this.toJSON = function() {
    return locations;
  };

  this.initialiseFromPDO = function(locationsListPDO) {
    locations = [];   // locations emptied just in case.
    var newLocation;
    for (var i = 0; i < locationsListPDO.length; i++){
      newLocation = new Location();
      newLocation.initialiseFromPDO(locationsListPDO[i]);
      locations.push(newLocation);
    }
  };



  function indexForLocation(latitude, longitude){
    for (var i = 0; i < locations.length; i++){
      if (latitude == locations[i].getLatitude() && longitude == locations[i].getLongitude())
        return i;
    }
    return -1;
  }
}

function loadLocations() {
  var locationsListJSON = localStorage.getItem(STORAGE_KEY);
  if (locationsListJSON) locationsList.initialiseFromPDO(JSON.parse(locationsListJSON));
}

function saveLocations() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(locationsList));
}

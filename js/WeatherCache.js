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
  this.getForecast = function() {
    return forecasts;
  };

  // Sets a property
  this.setForecast = function(key, value){
    forecasts[key] = value;
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
  var callbacks = {};
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

  this.getWeatherAtIndexForDate = function(index, date, callback) {
    var url, script;
    var location = locations[index];
    var forecast = location.getForecast();
    var apiString = apiStringify(location.getLatitude(), location.getLongitude(), date);
    if (forecast.hasOwnProperty(apiString)){
      callback(index, forecast[apiString]);
    } else {
      callbacks[apiString] = callback.bind(window);
      url = "https://api.forecast.io/forecast/" + WEATHER_API_KEY +  "/" + apiString +
            "?units=ca&exclude=currently,minutely,hourly,alerts,flags" +
            "&callback=locationsList.weatherResponse";
      script = document.createElement("script");
      script.src = url;
      script.id = "script" + index;
      document.body.appendChild(script);
    }
  };

  this.getCurrentWeather = function(latitude, longitude, callback) {
    var url, script;
    var apiString = apiStringify(latitude, longitude, new Date());
    callbacks[apiString] = callback.bind(window);
    url = "https://api.forecast.io/forecast/" + WEATHER_API_KEY +  "/" + apiString +
      "?units=ca&exclude=currently,minutely,hourly,alerts,flags" +
      "&callback=locationsList.weatherResponse";
    script = document.createElement("script");
    script.src = url;
    script.id = "scriptcurrent";
    document.body.appendChild(script);
  };

  this.weatherResponse = function(responseObj) {
    var date, index, callback, location;
    date = new Date(responseObj.daily.data[0].time * 1000);
    var responseString = apiStringify(responseObj.latitude, responseObj.longitude, date);

    if (callbacks.hasOwnProperty(responseString)){
      index = indexForLocation(responseObj.latitude, responseObj.longitude);
      if (index == -1) {
        index = "current";
      } else {
        // Add forecast property
        locations[index].setForecast(responseString, responseObj);
        saveLocations();
      }
      callback = callbacks[responseString];
      callback(index, responseObj);
      delete callbacks[responseString];
    }
  };

  function indexForLocation(latitude, longitude){
    for (var i = 0; i < locations.length; i++){
      if (latitude == locations[i].getLatitude() && longitude == locations[i].getLongitude())
        return i;
    }
    return -1;
  }

  function apiStringify(latitude, longitude, date){
    return latitude + "," + longitude + "," + date.apiDateString();
  }
}

function loadLocations() {
  var locationsListJSON = localStorage.getItem(STORAGE_KEY);
  if (locationsListJSON) locationsList.initialiseFromPDO(JSON.parse(locationsListJSON));
}

function saveLocations() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(locationsList));
}

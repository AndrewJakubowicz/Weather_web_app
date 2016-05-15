/**
 * Created by Spyr1014 on 15/05/2016.
 */

function indexInit() {
  ulBuilder();
}

// Builds the list for the page and initiates callbacks!
function ulBuilder() {
  var liBuild = function(location, index){
    var li = document.createElement("li");
    li.className = "mdl-list__item mdl-list__item--three-line";
    li.onclick = function(){
      viewLocation(index);
    };
    var primary_span = document.createElement("span");
    primary_span.className = "mdl-list__item-primary-content";
    var title_span = document.createElement("span");
    title_span.innerText = location.getName();
    var text_span = document.createElement("span");
    text_span.className = "mdl-list__item-text-body";
    text_span.setAttribute("id", index + "summary");
    text_span.innerText = "Loading weather summary...";

    var image = document.createElement("div");
    image.className = "mdl-list__item-icon mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active";
    image.setAttribute("id", index + "image");

    primary_span.appendChild(title_span);
    primary_span.appendChild(image);
    primary_span.appendChild(text_span);
    li.appendChild(primary_span);
    li.style.borderBottom = "1px solid #D3D3D3";
    return li;
  };

  // Populate the index list.
  var ul = document.getElementById("indexList");
  for (var i = 0; i < locationsList.length(); i++){
    ul.appendChild(liBuild(locationsList.locationAtIndex(i), i));
    locationsList.getWeatherAtIndexForDate(i, new Date(), populateIndexList);
  }
}

function viewLocation(index){
  localStorage.setItem(LOCATION_IDX, index);
  // Load the view location page.
  location.href = "viewlocation.html";
}

function populateIndexList(index, data){
  var image, summary, canvas;
  var skycons = new Skycons({"color": "black"});

  image = document.getElementById(index + "image");
  image.innerHTML = "";
  canvas = document.createElement("canvas");
  canvas.id = index + "canvas";
  canvas.className = "mdl-list__item-icon";
  image.parentNode.replaceChild(canvas, image);
  skycons.add(canvas, data.daily.data[0].icon);
  canvas.style.width = "80px";
  canvas.style.height = "50px";


  skycons.play();

  summary = document.getElementById(index + "summary");
  summary.innerText = data.daily.data[0].summary;

}
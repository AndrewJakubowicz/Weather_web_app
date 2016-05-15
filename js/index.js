/**
 * Created by Spyr1014 on 15/05/2016.
 */

function indexInit() {
  ulBuilder();

  // TODO: Load weather reports
}

// Builds the list for the page.
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

    return li;
  };

  // Populate the index list.
  var ul = document.getElementById("indexList");
  for (var i = 0; i < locationsList.length(); i++){
    ul.appendChild(liBuild(locationsList.locationAtIndex(i), i));
  }
}

function viewLocation(index){
  localStorage.setItem(LOCATION_IDX, index);
  // Load the view location page.
  location.href = "viewlocation.html";
}


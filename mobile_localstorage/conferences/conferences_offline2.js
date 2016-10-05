var isOnline = navigator.onLine;

if(isOnline == true) {
  console.log("online");
  if(localStorage.length != 0) {
    console.log("from localStorage");
    retrieveValueFromURL();
  }
  else {
    console.log("offline");
    //getJSON();
    retrieveValueFromURL();
  }
}
else {
  console.log("offline");
  retrieveValueFromURL();
}

function getJSON() {
  $.ajax({
    type: 'GET',
    url: 'http://strataconf.com/stratany2013/public/content/report/sm-schedule',
    dataType: 'jsonp',
    crossDomain: true,
    jsonp: "callbackName",
    jsonpCallback: "fromcs"                                                                                                                                      
  });
}

function functionCall(data) {

  var conferenceSerial;
  var keynoteData = [];
  var tutorialData = [];
  var sessionData = [];
  var speakersData = [];
  var venuesData = [];
  var allTypesData = [];

    $.each(data.Schedule.conferences, function (key, val) {
          conferenceSerial = this.serial;
          console.log("conference serial: " + conferenceSerial);
    });

    $.each(data.Schedule.events, function (key, val) {
        allTypesData = this.event_type;
          if(allTypesData == this.event_type) {
            var arrayName = allTypesData;
            arrayName = [this.name + "|" + this.event_type + "|" + this.time_start + "|" + this.time_stop + "|" + this.venue_serial + "|" + this.description + "|" + this.speakers + "|" + this.website_url + "|" + this.serial];
            addItem(allTypesData + "-" + this.serial, arrayName);
          }
    });

    $.each(data.Schedule.speakers, function (key, val) {
        addItem("speakers-" + this.serial, this.name);
    });

    $.each(data.Schedule.venues, function (key, val) {
        addItem("venues-" + this.serial, this.name);
    });
    
    retrieveValueFromURL();
  }

function addItem(serial, dataArray) {
  localStorage.setItem(serial, dataArray);
}

function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

function retrieveValueFromURL() {
  var typevalue = getURLParameter("typevalue");
  console.log(typevalue);
  retrieveValueFromLocalStorage(typevalue);
}

function retrieveValueFromLocalStorage(typevalue) {

  for (var i = 0; i < localStorage.length; i++) {

      var key = localStorage.key(i);

      if(key.indexOf(typevalue) !== -1) {
        var strKey = key;
        var strValue = localStorage.getItem(key);
        displayFromLocalStorage(strKey,strValue,typevalue);
      }
  }
}

function displayFromLocalStorage(key, value, typevalue) {

  // create an array of values from localStorage
  var valueToCells = value.split('|'); 

  // assign each value to a column name
   var name = valueToCells[0];
   var type = valueToCells[1];
   var start = valueToCells[2];
   var stop = valueToCells[3];
   var venue = valueToCells[4];
   var description = valueToCells[5];
   var speakers = valueToCells[6];
   var url = valueToCells[7];
   var serial = valueToCells[8];

   var updatedSpeakers = speakers;
   updatedSpeakers = updatedSpeakers.split(',');
   var updatedVenues = venue;

   for (var i = 0; i < localStorage.length; i++) {
       var key = localStorage.key(i);
       if(key.indexOf("speakers") !== -1) {
          for(j = 0; j < updatedSpeakers.length; j++) {
            if(key.substr(key.indexOf("-") + 1) == updatedSpeakers[j]) {
              var speakerNames = localStorage.getItem(key);         
              updatedSpeakers[j] = updatedSpeakers[j].replace(updatedSpeakers[j], speakerNames);
            }
          }
       }
       else if(key.indexOf("venues") !== -1) {
          if(key.substr(key.length - 4) == venue) {
            var venueNames = localStorage.getItem(key);
            updatedVenues = updatedVenues.replace(venue, venueNames);
          }
       }
   }

   var any = document.createElement('div');
   document.body.appendChild(any);
   any.class="tablist-content";
   any.innerHTML = "<p><strong>" + name + "</strong><br />&nbsp;&nbsp;&nbsp;Speaker(s): " + updatedSpeakers + "<br />&nbsp;&nbsp;&nbsp;Room: " + updatedVenues + "</p>";
   document.getElementById("display").appendChild(any);
}

/***** not using at present *****/
function addToList(key, value) {
   var ul = document.getElementById("items");
    var li = document.createElement("li");
    li.innerHTML = key + ": " + value;
    ul.appendChild(li);   
}

function clearDataAndReload() {
    if(isOnline == true) {
      alert("JSON data will be reloaded into localStorage and displayed on page.");
      location.reload();
    }
    else {
      alert("Sorry, you are offline. JSON data cannot be reloaded");
    }
}

function clearData() {
    localStorage.clear();
    alert("Local Storage has been cleared.");
}

function clearCache() {
    var appCache = window.applicationCache;

    if (appCache.status == appCache.UPDATEREADY) {
      appCache.swapCache();
    }

    alert("Application cache has been cleared.");
}


var isOnline = navigator.onLine;

if(isOnline == true) {
  console.log("online");
  if(localStorage.length != 0) {
    console.log("from localStorage");
    retrieveValueFromURL();
  }
  else {
    console.log("read JSON");
    getJSON();
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

    $.each(data.Schedule.conferences, function (key, val) {
          conferenceSerial = this.serial;
          console.log("conference serial: " + conferenceSerial);
    });

    $.each(data.Schedule.speakers, function (key, val) {
        addItem("speakers-" + this.serial, this.name);
    });

    $.each(data.Schedule.venues, function (key, val) {
        addItem("venues-" + this.serial, this.name);
    });

    $.each(data.Schedule.events, function (key, val) {

       if(this.event_type == "Keynote" || this.event_type == "keynote") {
        keynoteData = [this.name + "|" + this.event_type + "|" + this.time_start + "|" + this.time_stop + "|" + this.venue_serial + "|" + this.description + "|" + this.speakers + "|" + this.website_url + "|" + this.serial];
        addItem("keynote-" + this.serial,keynoteData);
       }
       else if(this.event_type == "Tutorial" || this.event_type == "tutorial") {   
        tutorialData = [this.name + "|" + this.event_type + "|" + this.time_start + "|" + this.time_stop + "|" + this.venue_serial + "|" + this.description + "|" + this.speakers + "|" + this.website_url + "|" + this.serial];
        addItem("tutorial-" + this.serial,tutorialData);
       }
       else if(this.event_type == "40-minute Session" || this.event_type == "40-minute session") {   
        sessionData = [this.name + "|" + this.event_type + "|" + this.time_start + "|" + this.time_stop + "|" + this.venue_serial + "|" + this.description + "|" + this.speakers + "|" + this.website_url + "|" + this.serial];
        addItem("session-" + this.serial,sessionData);
       }
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

   if(typevalue == "keynote") {
      var dk = document.createElement('div');
      document.body.appendChild(dk);
      dk.class="tablist-content";
      dk.innerHTML = "<a href='#'>" + name + "</a>";
      document.getElementById("keynote").appendChild(dk);
   }
   else if(typevalue == "session") {
      var ds = document.createElement('div');
      document.body.appendChild(ds);
      ds.class="tablist-content";
      ds.innerHTML = "<a href='#'>" + name + "</a>";
      document.getElementById("session").appendChild(ds);
   }
   else if(typevalue == "tutorial") {
      var dt = document.createElement('div');
      document.body.appendChild(dt);
      dt.class="tablist-content";
      dt.innerHTML = "<a href='#'>" + name + "</a>";
      document.getElementById("tutorial").appendChild(dt);
   }
   else {
      console.log("no parameter in URL");
   }
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
    //var appCache = window.applicationCache;

    //if (appCache.status == appCache.UPDATEREADY) {
    //  appCache.swapCache();
    //}

    alert("Application cache has been cleared.");
}


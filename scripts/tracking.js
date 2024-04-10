function fetchCurrentState(norad_number, object_path){

  if (norad_number == 25544) {

    mountedApp.source_URL = "https://api.wheretheiss.at/";

    activityLogging("requesting data");

      // Json response object example: 
  //   {
  //     "name": "iss",
  //     "id": 25544,
  //     "latitude": 50.11496269845,
  //     "longitude": 118.07900427317,
  //     "altitude": 408.05526028199,
  //     "velocity": 27635.971970874,
  //     "visibility": "daylight",
  //     "footprint": 4446.1877699772,
  //     "timestamp": 1364069476,
  //     "daynum": 2456375.3411574,
  //     "solar_lat": 1.3327003598631,
  //     "solar_lon": 238.78610691196,
  //     "units": "kilometers"
  // }

    API_URL = mountedApp.source_URL + "v1/satellites/" + norad_number + "?units=" + mountedApp.units; 
      // https://api.wheretheiss.at/v1/satellites/25544?units=miles
  fetch(API_URL)
  .then((response) => response.json())
  .then((data) => {

    // Signal that fetching process is happening:
    activityLogging("updating data");
    
    // Updates Earth's ilumination state (so far only for the 3D view):
    updateEarthIlumination(Number(data.timestamp));

    //Unit conversion:
    let time =  timestampToDateConversion(Number(data.timestamp));
        
    let current_state = {

      'index': object_path.length + 1,
      'name':  data.name,
      'id': data.id,
      'latitude': data.latitude,
      'longitude': data.longitude,
      'altitude': data.altitude,
      'velocity': data.velocity,
      'visibility': data.visibility,
      'footprint': data.footprint,
      'time': time,
      'daynum': data.daynum,
      'solarlatitude': data.solar_lat,
      'solarlongitude': data.solar_lon,
      'units': data.units
    
    }

    object_path.push(current_state);

    
  });
  }

  else {

    mountedApp.source_URL = "https://api.n2yo.com/";

 // {
    //   "info": {
    //       "satname": "GLAST",
    //       "satid": 33053,
    //       "transactionscount": 10
    //   },
    //   "positions": [
    //       {
    //           "satlatitude": 1.59605474,
    //           "satlongitude": -49.6133944,
    //           "sataltitude": 521.72,
    //           "azimuth": 272.08,
    //           "elevation": -19.96,
    //           "ra": 357.51721362,
    //           "dec": 1.78652055,
    //           "timestamp": 1711479150,
    //           "eclipsed": false
    //       }
    //   ]
    // }

    activityLogging("requesting data");

    // https://sky-vue-api.onrender.com/position/satellite_norad_number
    API_URL = "https://skyvue-ai.onrender.com/Position?satid=" + norad_number;

    fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {

      // Signal that fetching process is happening:
      activityLogging("updating data");
      
      // Updates Earth's ilumination state (so far only for the 3D view):
      updateEarthIlumination(Number(data.positions[0].timestamp));

      //Unit conversion:
      let time =  timestampToDateConversion(Number(data.positions[0].timestamp));

      let current_state = {

        'index': object_path.length + 1,
        'name':  data.info.satname,
        'id': data.info.satid,
        'latitude': data.positions[0].satlatitude,
        'longitude': data.positions[0].satlongitude,
        'altitude': data.positions[0].sataltitude,
        'velocity': data.velocity,
        'visibility': data.positions[0].eclipsed,
        'footprint': data.footprint,
        'time': time,
        'daynum': data.daynum,
        'solarlatitude': data.solar_lat,
        'solarlongitude': data.solar_lon,
        'units': data.units
      
      }

      object_path.push(current_state);
      
    }); 
  }

}

function activityLogging(activityLog){

  document.getElementById("log").textContent = activityLog;
  document.getElementById("log").style.transition = "all 0s";
  document.getElementById("log").style.opacity = 1;

  document.getElementById("log-loader").style.borderTopColor = "#ffffff";
  document.getElementById("log-loader").style.animation = "spin 0.1s linear infinite";
 
  
  setTimeout(() => {

    document.getElementById("log-loader").style.borderTopColor = "#f3f3f3a0";
    document.getElementById("log-loader").style.animation = "";
    
    document.getElementById("log").style.transition = "all 2s";
    document.getElementById("log").style.opacity = 0;

  }, mountedApp.loader_time);
  
}

function satbotActivityLogging(state){

  if (state === 'waiting') {
    document.getElementById("satbot-loader").style.borderTopColor = "#ffffff";
    document.getElementById("satbot-loader").style.animation = "spin 0.1s linear infinite";
  }
  else {
    document.getElementById("satbot-loader").style.borderTopColor = "#f3f3f3";
    document.getElementById("satbot-loader").style.animation = "spin 1s linear infinite";
    
    mountedApp.satbot_display = 'full';
    setTimeout(() => {
      mountedApp.satbot_display = 'retreated';
    }, 6000);

  }
  
}

function tleActivityLogging(state){

  if (state === 'waiting') {
    document.getElementById("tle-loader").style.borderTopColor = "#ffffff";
    document.getElementById("tle-loader").style.animation = "spin 0.1s linear infinite";
  }
  else {
    document.getElementById("tle-loader").style.borderTopColor = "#f3f3f3a0";
    document.getElementById("tle-loader").style.animation = "";

  }
  
}

function showUserLocation(user_location){
  
  // Check if geolocation is supported by the browser
  if ("geolocation" in navigator) {
    // Prompt the user for permission to access their location
    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        // Get the user's latitude and longitude coordinates
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        
        user_location[0] = latitude;
        user_location[1] = longitude;
        
        //Unit conversions, scaling and positional adjustments:
        user_picture_width = Number(document.getElementById("user-location").offsetWidth); 
        userY = (Number(latitude) - 90)*(-2.2222) - user_picture_width/2;
        userX = (Number(longitude) + 180)*(2.2222) - user_picture_width/2;
        
        document.getElementById("user-location").style.transform = "translate(" + userX + "px, " + userY +  "px)";
        document.getElementById("user-location").style.opacity = 1;

        // https://secure.geonames.org/countryCodeJSON?formatted=true&lat=47.03&lng=10.2&username=clodolinus&style=full
        fetch("https://secure.geonames.org/countryCodeJSON?formatted=true&lat=" + user_location[0] + "&lng=" + user_location[1] + "&username=clodolinus&style=full")
        .then((response) => response.json())
        .then((data) => {
          
          let country_code = data.countryCode;
          // country_code = 'BR';
          
          document.getElementById("user-location-name").textContent = country_code;
          let flagURL = "https://flagsapi.com/" + country_code + "/shiny/64.png";
          document.getElementById("user-location-flag").src = flagURL;
          
          user_picture_width = Number(document.getElementById("user-location").offsetWidth);
          positionY = (Number(latitude) - 90)*(-2.2222);
          positionX = (Number(longitude) + 180)*(2.2222);
          
          document.getElementById("user-location-flag").style.transform = "translate(" + (positionX - user_picture_width/2 -8) + "px, " + (positionY - user_picture_width/2 - 10) +  "px)";
          document.getElementById("user-location-name").style.transform = "translate(" + (positionX + 10) + "px, " + (positionY + 10) +  "px)";
          
        });

      },
      // Error callback
      (error) => {
        // Handle errors (e.g., if the user denied location sharing permissions)
        console.error("Error getting user location:", error);
      }
      );
  } else {
      // Geolocation is not supported by the browser
      console.error("Geolocation is not supported by this browser.");
  }
    
}
// updateMap([path_1, line_level_detail_1], ...)
function drawArray(path, detail_level, point_color = 'rgba(255, 255, 255, 1)', point_size = 0.1, point_strength = 10, canvas_ctx, delay_miliseconds = 0){

  // console.log('path: ', path);
   
  if(path.length === 0){
    return
  }

  let step = Math.floor(100/detail_level);

  for (let index = 0; index < path.length - 1; index += step) {

    // console.log('satellite: ', path[index]);

    latitude = path[index]['latitude'];
    longitude = path[index]['longitude'];

    // console.log(latitude);
    // console.log(longitude);
    // console.log('-----------------------------------');

    //Unit conversions:
    latitude = (Number(latitude) - 90)*(-2.2222);
    longitude = (Number(longitude) + 180)*(2.2222);
    
    scale_fix = 2.66;
    
    lat = latitude/scale_fix;
    lon = longitude/scale_fix;
    
     

    canvas_ctx.fillStyle = point_color;

    for (let stroke = 0; stroke < point_strength; stroke++) {
      canvas_ctx.fillRect(lon, lat, point_size, point_size);
    }
    
  }
  
}

// updateMap([path_1, line_level_detail_1], ...)
function drawActiveSatellites(path, detail_level, point_color = 'rgba(255, 255, 255, 1)', point_size = 0.1, point_strength = 10, canvas_ctx, delay_miliseconds = 0){

  // console.log('path: ', path);
   
  if(path.length === 0){
    return
  }

  canvas_ctx.fillStyle = point_color;

  let step = Math.floor(100/detail_level);

  let sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  const drawPoint = async (path) => {
    for (let position of path) {

      await sleep(delay_miliseconds);
      
      mountedApp.active_satellites_count++;

      // console.log('satellite: ', path[index]);
  
      let latitude = position['latitude'];
      let longitude = position['longitude'];
  
      // console.log(latitude);
      // console.log(longitude);
      // console.log('-----------------------------------');
  
      //Unit conversions:
      latitude = (Number(latitude) - 90)*(-2.2222);
      longitude = (Number(longitude) + 180)*(2.2222);
      
      let scale_fix = 2.66;
      
      let lat = latitude/scale_fix;
      let lon = longitude/scale_fix;
      
      for (let stroke = 0; stroke < point_strength; stroke++) {
        canvas_ctx.fillRect(lon, lat, point_size, point_size);
      }
      
         
    }
  }

  drawPoint(path);
    
  
}

function drawSatellitesCrossing(path, detail_level, point_color = 'rgba(255, 255, 255, 1)', point_size = 0.1, point_strength = 10, canvas_ctx, delay_miliseconds = 0){

  // console.log('path: ', path);
   
  if(path.length === 0){
    return
  }

  canvas_ctx.fillStyle = point_color;

  let sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  const drawPoint = async (path) => {
    for (let position of path) {
      
      await sleep(delay_miliseconds);

      mountedApp.satellites_crossing_count++;

      // console.log('satellite: ', path[index]);
  
      let latitude = position['latitude'];
      let longitude = position['longitude'];
  
      // console.log(latitude);
      // console.log(longitude);
      // console.log('-----------------------------------');
  
      //Unit conversions:
      latitude = (Number(latitude) - 90)*(-2.2222);
      longitude = (Number(longitude) + 180)*(2.2222);
      
      let scale_fix = 2.66;
      
      let lat = latitude/scale_fix;
      let lon = longitude/scale_fix;
      
      for (let stroke = 0; stroke < point_strength; stroke++) {
        canvas_ctx.fillRect(lon, lat, point_size, point_size);
      }
      
         
    }
  }

  drawPoint(path);
    
  
}

function updateMap(paths) {

  let canvas_ctx = document.getElementById('canvas2D').getContext('2d');
  canvas_ctx.clearRect(0, 0, canvas2D.width, canvas2D.height);
  
  paths.forEach(path => {
    drawArray(path[0], path[1], 'white', 0.1, 10, canvas_ctx);
  });
    
}

function updateObjectPosition(object_path){
  
  latitude = object_path[object_path.length-1]['latitude'];
  longitude = object_path[object_path.length-1]['longitude'];

  //Unit conversions, scaling and positional adjustments:
  satellite_picture_width = Number(document.getElementById("satellite").offsetWidth); 
  satY = (Number(latitude) - 90)*(-2.2222) - satellite_picture_width/2;
  satX = (Number(longitude) + 180)*(2.2222) - satellite_picture_width/2;

  visibility_radius_width = Number(document.getElementById("visibility-radius").offsetWidth); 
  radiusY = (Number(latitude) - 90)*(-2.2222) - visibility_radius_width/2;
  radiusX = (Number(longitude) + 180)*(2.2222) - visibility_radius_width/2;

  document.getElementById("satellite").style.transform = "translate(" + satX + "px, " + satY +  "px)";
  document.getElementById("visibility-radius").style.transform = "translate(" + radiusX + "px, " + radiusY +  "px)";

}

function updateNationalFlagPosition(object_path){
  
  latitude = object_path[object_path.length-1]['latitude'];
  longitude = object_path[object_path.length-1]['longitude']; 

  // https://secure.geonames.org/countryCodeJSON?formatted=true&lat=47.03&lng=10.2&username=clodolinus&style=full
  fetch("https://secure.geonames.org/countryCodeJSON?formatted=true&lat=" + latitude + "&lng=" + longitude + "&username=clodolinus&style=full")
  .then((response) => response.json())
  .then((data) => {
    
    let country_code = data.countryCode;
    
    // country_code = 'BR';   
    if (country_code != undefined){
      
      document.getElementById("satellite-location-name").textContent = country_code;
      let flagURL = "https://flagsapi.com/" + country_code + "/shiny/64.png";
      document.getElementById("satellite-location-flag").src = flagURL;
      
      satellite_picture_width = Number(document.getElementById("satellite").offsetWidth); 
      positionY = (Number(latitude) - 90)*(-2.2222);
      positionX = (Number(longitude) + 180)*(2.2222);

      document.getElementById("satellite-location-flag").style.transform = "translate(" + (positionX - satellite_picture_width/2 -5) + "px, " + (positionY - satellite_picture_width/2 - 5) +  "px)";
      document.getElementById("satellite-location-name").style.transform = "translate(" + (positionX + 10) + "px, " + (positionY + 10) +  "px)";

    }
    
    else{
      
      document.getElementById("satellite-location-flag").src = "";
      document.getElementById("satellite-location-name").textContent = "";
      
    }
    
  });

  

}
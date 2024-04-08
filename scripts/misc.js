function updateWikiInfo(){

  let info1 = "The International Space Station (ISS) is the largest modular space station currently in low Earth orbit.";
  let info2 = "The first ISS component was launched in 1998, and the first long-term residents arrived on 2 November 2000 after being launched from the Baikonur Cosmodrome on 31 October 2000."
  let info3 ="The ISS orbital period is about 90 minutes.";
  let info4 ="The station is divided into two sections: the Russian Orbital Segment (ROS) is operated by Russia, while the United States Orbital Segment (USOS) is run by the United States as well as by the other states.";
  let info5 = " As of April 2022, 251 astronauts, cosmonauts, and space tourists from 20 different nations have visited the space station, many of them multiple times.";
  let infoList = [info1, info2, info3, info4, info5];

  document.getElementsByClassName("wikiInfo")[0].textContent = infoList[Math.floor(Math.random() * infoList.length)];
  
}

function updateUnits(event){

  mountedApp.units = (event.target.value).toLowerCase();

  distance_unit_elements =  document.getElementsByClassName('distance-unit');
  velocity_unit_elements =  document.getElementsByClassName('velocity-unit');;

  if (mountedApp.units === 'miles') {

    for (let index = 0; index < distance_unit_elements.length; index++) {
      distance_unit_elements[index].textContent = "miles";
    }

    for (let index = 0; index < velocity_unit_elements.length; index++) {
      velocity_unit_elements[index].textContent = "mph";
    }

  } else {
    if (mountedApp.units = 'kilometers') {

      for (let index = 0; index < distance_unit_elements.length; index++) {
        distance_unit_elements[index].textContent = "Km";
      }

      for (let index = 0; index < velocity_unit_elements.length; index++) {
        velocity_unit_elements[index].textContent = "km/h";
      }
  
    }
  }

}
  
function timestampToDateConversion(timestamp){

  const utcSeconds = timestamp; // Example epoch time in seconds
  const date = new Date(0); // The 0 sets the date to the epoch
  date.setUTCSeconds(utcSeconds);
  date.toGMTString()+"<br>"+date.toLocaleString();  

  return date;

}

function timestampToArray(timestamp) {

  const utcSeconds = timestamp; // Example epoch time in seconds
  const date = new Date(0); // The 0 sets the date to the epoch
  date.setUTCSeconds(utcSeconds);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minutes = date.getUTCMinutes();
 
  timeArray = [year, month, day, hour, minutes];

  return timeArray;
}

function copyCoordinates(){

  let copyInfo = document.getElementById("latitude").value + ", " +
  document.getElementById("longitude").value  + ", " +
  document.getElementById("altitude").value + ", " +
  document.getElementById("time").value;


  navigator.clipboard.writeText(copyInfo);

  alert("Copied the coordinates: " + copyInfo);

}

// Making an element A inherit the height value from an element B .
function makeSameHeightByID(elementA_id, elementB_id){
  
  const sourceValue = document.getElementById(elementB_id).clientHeight;
  document.getElementById(elementA_id).style.height = sourceValue + "px";

}

// window.addEventListener('load', function() {
//   document.querySelector('.loader').style.display = 'none';
// });


function gradualOpacity(className, timeToAppear){

  elementsOfClass = document.getElementsByClassName(className);
 
  for (let index = 0; index < elementsOfClass.length; index++) {
  
    elementsOfClass[index].style.transition = 'opacity 0s'; 
    elementsOfClass[index].style.opacity = 0;
      
  }
 
  setTimeout(() => {
    
  for (let index = 0; index < elementsOfClass.length; index++) {
  
    elementsOfClass[index].style.transition = 'opacity 3s'; 
    elementsOfClass[index].style.opacity = 1;
      
  }
  }, timeToAppear);
  
}

function map2DGradualAppearance(timeToAppear){

  setTimeout(() => {
    document.getElementById('map2D-container').style.transition = 'height 1.5s';  
    document.getElementById('map2D-container').style.height = '400px';  

    setTimeout(() => {
      showUserLocation(mountedApp.user_location);
    }, 500);
    
  }, timeToAppear);
  
}


function updateEarthIlumination(timestamp){
    //Time unit conversion to compute Earth's ilumination:
  // returns [year, month, day, hour, minutes]
  ymdhm = timestampToArray(timestamp);
  // Computing and updating Earth's ilumination:
  updateSunlightDirection(ymdhm);
}

console.log("main.js connected")

window.onload = function(){

if($("#newJobPickupTimeDate").flatpickr){
  document.getElementById("newJobPickupTimeDate").flatpickr({
    minDate: new Date(), // "today" / "2016-12-20" / 1477673788975
    maxDate: new Date(new Date().getTime()+(10*24*60*60*1000)), // this is for 10 days
    enableTime: true,

    // create an extra input solely for display purposes
    altInput: true,
    altFormat: "F j, Y h:i K"
  });
}

if($("#newJobDropoffTimeDate").flatpickr){
  document.getElementById("newJobDropoffTimeDate").flatpickr({
    minDate: new Date(), // "today" / "2016-12-20" / 1477673788975
    maxDate: new Date(new Date().getTime()+(10*24*60*60*1000)), // this is for 10 days
    enableTime: true,

    // create an extra input solely for display purposes
    altInput: true,
    altFormat: "F j, Y h:i K"
  });
}


$("#newJobPickupPostalCode").keyup(function(){
  var postalcode = $(this).val()
  if(postalcode >= 100000 && postalcode <= 999999){
    $("#pickupPostalcodeValidation").empty()
    $("#pickupPostalcodeValidation").append('<span class="validation-green">OK</span>')
    $.get("http://maps.googleapis.com/maps/api/geocode/json?address="+postalcode, function(data, status){
      if(data.status == "ZERO_RESULTS"){
        $("#pickupPostalcodeValidation").empty()
        $("#pickupPostalcodeValidation").append('<span class="validation-red">Please enter valid postal code</span>')
      } else {
        $("#newJobPickupLatitude").val(data.results[0].geometry.location.lat)
        $("#newJobPickupLongitude").val(data.results[0].geometry.location.lng)
        console.log($("#newJobPickupLatitude").val(), $("#newJobPickupLongitude").val())
        updatePrice()
      }
    })
  } else {
    $("#pickupPostalcodeValidation").empty()
    $("#pickupPostalcodeValidation").append('<span class="validation-red">This needs to be 6 digits</span>')
  }
})

$("#newJobDropoffPostalCode").keyup(function(){
  var postalcode = $(this).val()
  if(postalcode >= 100000){
    $("#dropoffPostalcodeValidation").empty()
    $("#dropoffPostalcodeValidation").append('<span class="validation-green">OK</span>')
    $.get("http://maps.googleapis.com/maps/api/geocode/json?address="+postalcode, function(data, status){
      if(data.status == "ZERO_RESULTS"){
        $("#dropoffPostalcodeValidation").empty()
        $("#dropoffPostalcodeValidation").append('<span class="validation-red">Please enter valid postal code</span>')
      } else {
        $("#newJobDropoffLatitude").val(data.results[0].geometry.location.lat)
        $("#newJobDropoffLongitude").val(data.results[0].geometry.location.lng)
        console.log($("#newJobDropoffLatitude").val(), $("#newJobDropoffLongitude").val())
        updatePrice()
      }
    })
  } else {
    $("#dropoffPostalcodeValidation").empty()
    $("#dropoffPostalcodeValidation").append('<span class="validation-red">This needs to be 6 digits</span>')
  }
})

$("#newJobItemType").change(function(){
  // if item size change, update price
  updatePrice()
})


function updatePrice(){
  if (checkIfBothGPSCoordinatesExist()){
    // get distance between two locations. BONUS: to add google maps routing api
    var dist = calcCrow($("#newJobPickupLatitude").val(),$("#newJobPickupLongitude").val(),$("#newJobDropoffLatitude").val(),$("#newJobDropoffLongitude").val()).toFixed(1)
    $("#newJobPrice").val(priceDistanceLogic(dist)* priceSizeLogic($("#newJobItemType").val()))
  }
}

function checkIfBothGPSCoordinatesExist(){
  if ($("#newJobDropoffLongitude").val() !== "" && $("#newJobPickupLongitude").val() !== ""){
    return true
  } else {
    return false
  }
}

function priceDistanceLogic(distanceApart){
  if (distanceApart < 5){
    return 5
  } else if (distanceApart < 10) {
    return 8
  } else if (distanceApart < 20) {
    return 12
  } else if (distanceApart < 30) {
    return 20
  } else {
    return 30
  }
}

function priceSizeLogic(size){
  if (size == 1 ){
    return 1
  } else if (size == 2){
    return 1.2
  } else if (size == 3){
    return 1.8
  } else if (size == 4) {
    return 3
  } else {
    return 5
  }
}

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcCrow(lat1, lon1, lat2, lon2)
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value)
{
    return Value * Math.PI / 180;
}


}

// Drop offs
// $( "#noOfPackagesToBeSent" ).change(function() {
//   console.log("change made")
//   var noOfDropOffs = this.value
//   $( "#dropoffForms" ).empty()
//   for (var i = 1 ; i <= noOfDropOffs ; i++){
//     $( "#dropoffForms" ).append(
//       '<div class="row"><h5>Drop off '+ i +'</h5></div><div class="row"><div class="six columns"><label for="newJobPickupAddress">Address</label><input class="u-full-width" type="text" name="pickupAddress" placeholder="Where do we pick up from?" id="newJobPickupAddress"></div><div class="six columns"><label for="newJobPickupPostalCode">Postal Code</label><input class="u-full-width" type="email" name="pickupPostalCode" placeholder="ruldoph@northpole.com" id="newUserEmail"></div></div><div class="row"><div class="six columns"><label for="newJobPickupContactName">Sender Name</label><input class="u-full-width" type="text" name="pickupContactName" placeholder="Who do we look for?" id="newJobPickupContactName" ></div><div class="six columns"><label for="newJobPickupContactNumber">Contact</label><input class="u-full-width" type="number" name="pickupContactNumber" placeholder="Where do we call?" id="newJobPickupContactNumber"></div></div><div class="row"><label for="newUserType">Pickup Date & Time</label><input type="text" id="newPickupTimeDate" class="u-full-width" placeholder="select date & time" /></div>'
//     )
//   }
//
// });

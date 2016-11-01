console.log("main.js connected")

window.onload = function(){

document.getElementById("newJobPickupTimeDate").flatpickr({
  minDate: new Date(), // "today" / "2016-12-20" / 1477673788975
  maxDate: new Date(new Date().getTime()+(10*24*60*60*1000)), // this is for 10 days
  enableTime: true,

  // create an extra input solely for display purposes
  altInput: true,
  altFormat: "F j, Y h:i K"
});

document.getElementById("newJobDropoffTimeDate").flatpickr({
  minDate: new Date(), // "today" / "2016-12-20" / 1477673788975
  maxDate: new Date(new Date().getTime()+(10*24*60*60*1000)), // this is for 10 days
  enableTime: true,

  // create an extra input solely for display purposes
  altInput: true,
  altFormat: "F j, Y h:i K"
});

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

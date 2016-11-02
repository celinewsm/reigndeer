$( document ).ready(function() {

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

});

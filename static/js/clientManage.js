$(document).ready(function() {

  if(currentUserClient){
    console.log("user found", currentUserClient)
    // client will join channels the jobs created that are not cancelled OR archived
    socket.emit('client join channels', currentUserClient.id);
  } else {
    console.log("user not found")
  }

});

import React from 'react';
import {render} from 'react-dom';

import io from 'socket.io-client'
let socket = io(window.location.host)

var startTrackingCourierLocation

var CourierManageJobs = React.createClass({
  getInitialState: function () {
    return {
      initialJobs: jobsAccepted,
      jobs: [],
    }
  },
  componentWillMount: function () {
    this.setState({jobs: this.state.initialJobs})
  },
  componentDidMount: function(){
    // might only need it on manage page
    socket.emit('courier join channels', currentUserCourier.id);
    socket.on('update courier on job update', this.clientUpdatesJob);
  },
  clientUpdatesJob: function(job){
    console.log("does it reach here?",job)

    for(var i in this.state.jobs){
       if(this.state.jobs[i].id === job.id){
         var newJobs = this.state.jobs
         newJobs[i] = job,

         this.setState({
           jobs: newJobs
         })
         break
       }
     }
  },
  render: function () {
    return (

      <div className="container">
        <div className="row text-align-center">
          <h3 className="top-margin white-font">Jobs Accepted</h3>
        </div>
        {
          this.state.jobs.map(function(job) {
            return <Job key={job.id} job={job} />
          }.bind(this))
        }
      </div>

    );
  }
});

var Job = React.createClass({
  getInitialState: function(){
    return this.props.job
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps.job);
},
componentDidMount: function(){
  if (this.state.status === "Enroute to pickup"){
    this.courierStartsPickup()
  } else if (this.state.status === "Enroute to deliver"){
    this.courierStartsDelivery()
  }
},
clientRating: function(){
  if (this.state.clientDetails.rating){
    return (
      <div className="inline-block">
        <p className="tiny-top-margin zero-paddings zero-margins status-font-size">{this.state.clientDetails.name} - {this.state.clientDetails.rating}/5 out of {this.state.clientDetails.jobQty} requests</p>
      </div>
    )
  } else {
    return (
      <div className="inline-block">
        <p className="tiny-top-margin zero-paddings zero-margins status-font-size">{this.state.clientDetails.name}</p>
      </div>
    )
  }
},
courierStartsPickup: function(){

  this.setState({
    status: "Enroute to pickup"
  })

  var obj = this
  findAndSetCourierLocation(obj)
  startTrackingCourierLocation = setInterval(findAndSetCourierLocation(obj), 5000);
  // use 60000 after testing
},
pauseCourierActivity: function(){
  this.setState({
    status: "Accepted"
  })

  if(startTrackingCourierLocation){
    clearInterval(startTrackingCourierLocation)
  }

  socket.emit('pause courier activity', {jobId: this.state.id,
                                          status: "Accepted"});

},
courierStartsDelivery: function(){

    this.setState({
      status: "Enroute to deliver"
    })

    findAndSetCourierLocation(this)
},
courierCompletedDelivery: function(){

  this.setState({
    status: "Delivered"
  })

  findAndSetCourierLocation(this)


  clearInterval(startTrackingCourierLocation)

},
buttonToShow: function(){
  if (this.state.status === "Accepted"){
    return <div><button type="button" name="button" onClick={() => this.courierStartsPickup()} >Enroute Pickup</button></div>
  } else if (this.state.status === "Enroute to pickup"){
    return (
      <div>
        <button type="button" name="button" onClick={() => this.courierStartsDelivery()} >Enroute Delivery</button>
        <button type="button" name="button" onClick={() => this.pauseCourierActivity()} >Pause</button>

      </div>
    )
  } else if(this.state.status === "Enroute to deliver"){

    return (
      <div>
        <button type="button" name="button" onClick={() => this.courierCompletedDelivery()} >Delivery Made</button>
        <button type="button" name="button" onClick={() => this.pauseCourierActivity()} >Pause</button>

      </div>
    )
  } else if (this.state.status === "Enroute to deliver") {
    return (
      <div>
        <button type="button" name="button">Delivered</button>
  </div>
    )
  }
},
render: function(){
      return (
        <div className="row white-box">

          <div className="row">
            <div className="ten columns offset-by-one">
              <p className="tinyfont">ID1300{this.state.id}</p>
              {this.clientRating()}
            </div>
          </div>
           <div className="row">
            <div className="five columns offset-by-one top-bottom-padding">
              <p className="tiny-margin"><strong>Pickup</strong></p>
              <p className="tiny-margin">{this.state.pickupContactName} ({this.state.pickupContactNumber})</p>
              <p className="tiny-margin">{this.state.pickupAddress},Singapore {this.state.pickupPostalCode}</p>
              <p className="tiny-margin">{this.state.pickupTimeDate.slice(0,10)} {this.state.pickupTimeDate.slice(11,16)}</p>
            </div>
             <div className="five columns top-bottom-padding">
              <p className="tiny-margin"><strong>Dropoff</strong></p>
              <p className="tiny-margin">{this.state.dropoffContactName}({this.state.dropoffContactNumber})</p>
              <p className="tiny-margin">{this.state.dropoffAddress}, Singapore {this.state.dropoffPostalCode}</p>
              <p className="tiny-margin">{this.state.dropoffTimeDate.slice(0,10)} {this.state.dropoffTimeDate.slice(11,16)}</p>
             </div>
            </div>

            <div className="row">
              <strong>${this.state.price}</strong> ({this.state.itemCategory.name})
             </div>

             <div className="row">
              <div className="ten columns offset-by-one text-align-center tiny-top-margin">
                {this.buttonToShow()}
              </div>
             </div>
            </div>
      )
  }
})


var findAndSetCourierLocation = function(thisObject){

  if (!navigator.geolocation){
    console.log("geolocation not supported");
    return;
  } else {
      navigator.geolocation.getCurrentPosition(success, error);
  }

  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    console.log('Courier current latitude: ' + latitude + '° Longitude: ' + longitude + '°')

    thisObject.setState({
      courierCurrentLatitude: latitude,
      courierCurrentLongitude: longitude
    })

    // if ( obj.state.courierCurrentLatitude != latitude && obj.state.courierCurrentLongitude != longitude){
      socket.emit('update courier position', {jobId: thisObject.state.id,
                                              status: thisObject.state.status,
                                            courierCurrentLatitude: latitude,
                                              courierCurrentLongitude: longitude});
    // }

  };
  function error() {
    console.log("Unable to retrieve your location")
  };

}


if(document.getElementById('courierManageJobs') !== null){
  render(<CourierManageJobs/>, document.getElementById('courierManageJobs'));
}

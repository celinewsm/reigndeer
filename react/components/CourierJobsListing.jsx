import React from 'react';
import {render} from 'react-dom';

import io from 'socket.io-client'
let socket = io(window.location.host)


var CourierJobsListing = React.createClass({
  getInitialState: function () {
    return {
      initialJobs: jobsAvailable,
      jobs: [],
      nearMeTriggered: false,
    }
  },
  acceptJob: function(jobId){
    for ( var i = 0 ; i < this.state.jobs.length ; i++ ){
      if (this.state.jobs[i].id === jobId){
        var jobs = this.state.jobs
        jobs.splice(i, 1)
        this.setState({
          jobs: jobs
        })
        socket.emit('courier accepts job', {jobId: jobId, courierId: currentUserCourier.id});
      }
    }
  },
  componentWillMount: function () {
    this.setState({jobs: this.state.initialJobs})
  },
  componentDidMount: function(){

    // might only need it on manage page
    socket.emit('courier join channels', currentUserCourier.id);
    this.getUserLocation()
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
  getUserLocation: function(){
    console.log("execute getUserLocation")
  if (!navigator.geolocation){
    console.log("geolocation not supported");
    return;
  }
  var obj = this;
  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    console.log('Latitude is ' + latitude + '° Longitude is ' + longitude + '°')

    obj.setState({userCurrentLatitude: latitude,
                  userCurrentLongitude: longitude})
    // console.log("https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false")

  };
  function error() {
    console.log("Unable to retrieve your location")
  };

  navigator.geolocation.getCurrentPosition(success, error);

},
filterByNearby: function(){
    var obj = this
    // distance between pick up point and distance between user less than 10 km
    var filteredJobs = this.state.jobs.filter(function (job) { return calcCrow(job.pickupLatitude,job.pickupLongitude,obj.state.userCurrentLatitude,obj.state.userCurrentLongitude) < 5 })

    console.log(filteredJobs)
    this.setState({
      oldJobs: this.state.jobs,
      jobs: filteredJobs,
      nearMeTriggered: true,
    })


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

},
buttonToShow: function(){
  if(!this.state.nearMeTriggered){
    if(this.state.userCurrentLatitude !== undefined){
      return <div><button className="white-text-white-border-button" onClick={() => this.filterByNearby() }>Near Me</button></div>
    }
  } else {
    return <div><button className="white-text-white-border-button" onClick={() => this.previousQuery() }>View All</button></div>

  }
},
previousQuery: function(){
  this.setState({
    jobs: this.state.oldJobs,
    nearMeTriggered: false,
  })
},
  render: function () {
    return (
      <div className="container">
        <div className="row text-align-center">
          <h3 className="top-margin white-font zero-bottom-margin">Jobs Available</h3>
        </div>
        {this.buttonToShow()}
        {
          this.state.jobs.map(function(job) {
            return <Job key={job.id} job={job} acceptJob={this.acceptJob} />
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
clientRating: function(){
  if (this.state.clientDetails.rating){
    return (
      <div className="inline-block">
        <p className="tiny-top-margin zero-paddings zero-margins status-font-size">{this.state.clientDetails.name} - {this.state.clientDetails.rating}/5 out of {this.state.clientDetails.jobQty} requests</p>
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
                <button type="button" name="button" onClick={() => this.props.acceptJob(this.state.id)} >Accept</button>
              </div>
             </div>
            </div>

      )
  }
})


if(document.getElementById('courierJobsListing') !== null){
  render(<CourierJobsListing/>, document.getElementById('courierJobsListing'));
}

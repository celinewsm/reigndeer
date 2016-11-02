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
      return <div><button onClick={() => this.filterByNearby() }>Near Me</button></div>
    }
  } else {
    return <div><button onClick={() => this.previousQuery() }>View All</button></div>

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
          <h1 className="zero-margins">Jobs Available</h1>
          {this.buttonToShow()}
        </div>
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
        <div className="inline-block">{this.state.clientDetails.rating}/5 out of {this.state.clientDetails.jobQty} requests</div>
    )
  }
},
render: function(){
      return (
        <div className="row" style={{"border": "1px solid black",
                                "padding": "1em",
                              "marginBottom": "1.5em"}}>
        <div className="row">
            <div className="eight columns offset-by-one">
              <h5 className="zero-margins">JobID: 1300{this.state.id}</h5>
              <div>Requested by: {this.state.clientDetails.name}, {this.clientRating()}</div>
            </div>
            <div className="two columns text-align-center">
              <strong>${this.state.price}</strong> ({this.state.itemCategory.name})<br/>
              <button type="button" name="button" onClick={() => this.props.acceptJob(this.state.id)} >Accept</button>
            </div>
          </div>
          <div className="row">
          </div>
          <div className="row">
            <div className="five columns offset-by-one">
              <div className="row">
                  <p className="zero-margins"><u>Pickup</u></p>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Contact</strong>
                </div>
                <div className="nine columns">
                  {this.state.pickupContactName} ({this.state.pickupContactNumber})
                </div>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Address</strong>
                </div>
                <div className="nine columns">
                  {this.state.pickupAddress}, {this.state.pickupPostalCode}
                </div>
              </div>

              <div className="row">
                <div className="three columns">
                <strong>Time</strong>
                </div>
                <div className="nine columns">
                  <p>
                    {this.state.pickupTimeDate.slice(0,10)}, {this.state.pickupTimeDate.slice(11,16)}
                  </p>
                </div>
              </div>

            </div>

            <div className="five columns">
              <p className="zero-margins"><u>Dropoff</u></p>
              <div className="row">
                <div className="three columns">
                <strong>Contact</strong>
                </div>
                <div className="nine columns">
                  {this.state.dropoffContactName} ({this.state.dropoffContactNumber})
                </div>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Address</strong>
                </div>
                <div className="nine columns">
                  {this.state.dropoffAddress}, {this.state.dropoffPostalCode}
                </div>
              </div>

              <div className="row">
                <div className="three columns">
                <strong>Time</strong>
                </div>
                <div className="nine columns">
                    <p>
                      {this.state.dropoffTimeDate.slice(0,10)}, {this.state.dropoffTimeDate.slice(11,16)}
                    </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )
  }
})


if(document.getElementById('courierJobsListing') !== null){
  render(<CourierJobsListing/>, document.getElementById('courierJobsListing'));
}

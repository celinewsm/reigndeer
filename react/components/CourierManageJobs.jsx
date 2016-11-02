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
  render: function () {
    return (
      <div className="container">
        <div className="row text-align-center">
          <h1 className="zero-margins">Jobs Accepted</h1>
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
clientRating: function(){
  if (this.state.clientDetails.rating){
    return (
        <div className="inline-block">{this.state.clientDetails.rating}/5 out of {this.state.clientDetails.jobQty} requests</div>
    )
  }
},
courierStartsPickup: function(){

  this.setState({
    status: "Enroute to pickup"
  })

  var obj = this
  startTrackingCourierLocation = setInterval(function(){
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

      obj.setState({
        courierCurrentLatitude: latitude,
        courierCurrentLongitude: longitude
      })

      // if ( obj.state.courierCurrentLatitude != latitude && obj.state.courierCurrentLongitude != longitude){
        socket.emit('update courier position', {jobId: obj.state.id,
                                                status: "Enroute to pickup",
                                                courierCurrentLatitude: latitude,
                                                courierCurrentLongitude: longitude});
      // }

    };
    function error() {
      console.log("Unable to retrieve your location")
    };

}, 5000);
// use 60000 after testing
},
pauseCourierActivity: function(){
  this.setState({
    status: "Accepted"
  })
  clearInterval(startTrackingCourierLocation)

  socket.emit('pause courier activity', {jobId: this.state.id,
                                          status: "Accepted"});

},
courierStartsDelivery: function(){

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
    return <div><button type="button" name="button" onClick={() => this.courierCompletedDelivery()} >Delivery Made</button></div>
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
              {this.buttonToShow()}
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


if(document.getElementById('courierManageJobs') !== null){
  render(<CourierManageJobs/>, document.getElementById('courierManageJobs'));
}

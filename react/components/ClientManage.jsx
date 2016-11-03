import React from 'react';
import {render} from 'react-dom';

import io from 'socket.io-client'
let socket = io(window.location.host)


var ClientManage = React.createClass({
  getInitialState: function () {
    return {
      initialJobs: jobsCreatedByUser,
      jobs: []
    }
  },
  componentWillMount: function () {
    this.setState({jobs: this.state.initialJobs})
  },
  componentDidMount: function(){
    socket.emit('client join channels', currentUserClient.id);
    socket.on('courier accepted client job', this.courierUpdatesJob);
    socket.on('courier updated status and/or position', this.courierUpdatesJob);

  },
  courierUpdatesJob: function(job){
    console.log("courierUpdateJob data:",job)

    for(var i in this.state.jobs){
       if(this.state.jobs[i].id === job.id){
         var jobs = this.state.jobs
         jobs[i] = job,

         this.setState({
           jobs: jobs
         })
         break
       }
     }
  },
  clientUpdateJob: function(jobId,updatedJob){

   for(var i in this.state.jobs){
      if(this.state.jobs[i].id === jobId){
        var jobs = this.state.jobs

        jobs[i].pickupContactNumber = updatedJob.pickupContactNumber,
        jobs[i].pickupContactName = updatedJob.pickupContactName,
        jobs[i].dropoffContactNumber = updatedJob.dropoffContactNumber,
        jobs[i].dropoffContactName = updatedJob.dropoffContactName,

        this.setState({
          jobs: jobs
        })

        socket.emit('client updates job', updatedJob);

        break
      }
    }
 },
 cancelJob: function(jobId){
  for ( var i = 0 ; i < this.state.jobs.length ; i++ ){
    if (this.state.jobs[i].id === jobId){
      var jobs = this.state.jobs
      jobs.splice(i, 1)
      this.setState({
        jobs: jobs
      })
      socket.emit('client cancels job', jobId);
    }
  }
},
  render: function () {
    return (
      <div className="container">
        <div className="row text-align-center">
          <h1>Jobs ordered</h1>
        </div>
        {
          this.state.jobs.map(function(job) {
            return <Job key={job.id} job={job} clientUpdateJob={this.clientUpdateJob} cancelJob={this.cancelJob} />
          }.bind(this))
        }
      </div>
    );
  }
});

var Job = React.createClass({
  getInitialState: function(){
    return {
      id: this.props.job.id,
      clientId: this.props.job.clientId,
      courierId: this.props.job.courierId,
      courierDetails:this.props.job.courierDetails,
      status: this.props.job.status, // pending, assigned, enroute to pickup, enroute to deliver, completed, cancelled
      itemType: this.props.job.itemType,
      itemDescription: this.props.job.itemDescription,
      pickupLatitude: this.props.job.pickupLatitude,
      pickupLongitude: this.props.job.pickupLongitude,
      pickupTimeDate: this.props.job.pickupTimeDate,
      pickupAddress: this.props.job.pickupAddress,
      pickupPostalCode: this.props.job.pickupPostalCode,
      pickupCountryId: this.props.job.pickupCountryId, // assign first
      pickupContactName: this.props.job.pickupContactName,
      pickupContactNumber: this.props.job.pickupContactNumber,
      dropoffLatitude: this.props.job.dropoffLatitude,
      dropoffLongitude: this.props.job.dropoffLongitude,
      dropoffTimeDate: this.props.job.dropoffTimeDate,
      dropoffAddress: this.props.job.dropoffAddress,
      dropoffPostalCode: this.props.job.dropoffPostalCode,
      dropoffCountryId: this.props.job.dropoffCountryId, // assign first
      dropoffContactName: this.props.job.dropoffContactName,
      dropoffContactNumber: this.props.job.dropoffContactNumber,
      courierCurrentLatitude: this.props.job.courierCurrentLatitude, // to be updated when not assigned && not completed
      courierCurrentLongitude: this.props.job.courierCurrentLongitude,
      price: this.props.job.price,
      editing: false,
    }
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps.job);
},
toggleEdit: function() {
  if (this.state.editing){
    this.setState({
      editing: false
      });
  } else {
    this.setState({
      editing: true
      });
  }
},
saveState: function(){
  var updatedJob ={
    id: this.state.id,
    pickupContactNumber: $("#editPickupContactNumber").val(),
    pickupContactName: $("#editPickupContactName").val(),
    dropoffContactNumber: $("#editDropoffContactNumber").val(),
    dropoffContactName: $("#editDropoffContactName").val(),
    editing: false
  }
  this.setState(updatedJob);
  this.props.clientUpdateJob(this.state.id,updatedJob)

},
acceptedByCourier: function(){
  if (this.state.courierDetails !== null){
      return(
        <div className="ten columns offset-by-one">
          <div>{this.state.courierDetails.name} will be making the delivery and can be contacted at {this.state.courierDetails.mobile}.</div>
        </div>
      )
  }
},
render: function(){
    if (!this.state.editing){
      return (
        <div className="row" style={{"border": "1px solid black",
                                "padding": "1em",
                              "marginBottom": "1.5em"}}>
        <div className="row">
            <div className="five columns offset-by-one">
              <h5>JobID:1300{this.state.id} | Status:{this.state.status}</h5>
            </div>
            <div className="five columns text-align-right">
              <button type="button" name="button" onClick={() => this.toggleEdit()} >Edit</button>
              <button type="button" name="button" onClick={() => this.props.cancelJob(this.state.id)} >Cancel</button>
            </div>
          </div>

          <div className="row">
            <div className="ten columns offset-by-one">
              <GMap />
            </div>
          </div>

          <div className="row">
            <div className="five columns offset-by-one">
              <div className="row">
                  <h5>Pickup</h5>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Name</strong>
                </div>
                <div className="nine columns">
                  {this.state.pickupContactName}
                </div>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Contact</strong>
                </div>
                <div className="nine columns">
                  {this.state.pickupContactNumber}
                </div>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Address</strong>
                </div>
                <div className="nine columns">
                  {this.state.pickupAddress}, <br/>
                  Singapore {this.state.pickupPostalCode}
                </div>
              </div>

              <div className="row">
                <div className="three columns">
                <strong>Date</strong>
                </div>
                <div className="nine columns">
                    {this.state.pickupTimeDate.slice(0,10)}
                </div>
              </div>

              <div className="row">
                <div className="three columns">
                <strong>Time</strong>
                </div>
                <div className="nine columns">
                  <p>
                    {this.state.pickupTimeDate.slice(11,16)}
                  </p>
                </div>
              </div>

            </div>

            <div className="five columns">
              <h5>Dropoff</h5>
              <div className="row">
                <div className="three columns">
                <strong>Name</strong>
                </div>
                <div className="nine columns">
                  {this.state.dropoffContactName}
                </div>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Contact</strong>
                </div>
                <div className="nine columns">
                  {this.state.dropoffContactNumber}
                </div>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Address</strong>
                </div>
                <div className="nine columns">
                  {this.state.dropoffAddress}, <br/>
                  Singapore {this.state.dropoffPostalCode}
                </div>
              </div>

              <div className="row">
                <div className="three columns">
                <strong>Date</strong>
                </div>
                <div className="nine columns">
                    {this.state.dropoffTimeDate.slice(0,10)}
                </div>
              </div>

              <div className="row">
                <div className="three columns">
                <strong>Time</strong>
                </div>
                <div className="nine columns">
                  <p>
                    {this.state.dropoffTimeDate.slice(11,16)}
                  </p>
                </div>
              </div>


            </div>
            <div className="row">
              {this.acceptedByCourier()}
            </div>
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="row" style={{"border": "1px solid black",
                                "padding": "1em",
                              "marginBottom": "1.5em"}}>
        <div className="row">
            <div className="five columns offset-by-one">
              <h5>JobID:1300{this.state.id} | Status:{this.state.status}</h5>
            </div>
            <div className="five columns text-align-right">
              <button type="button" name="button" onClick={() => this.saveState()} >Save</button>
              <button type="button" name="button" onClick={() => this.toggleEdit()} >Close Edit</button>
            </div>
          </div>

          <div className="row">
            <div className="five columns offset-by-one">
              <div className="row">
                  <h5>Pickup</h5>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Name</strong>
                </div>
                <div className="nine columns">
                  <input type="text" id="editPickupContactName" defaultValue={this.state.pickupContactName}></input>
                </div>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Contact</strong>
                </div>
                <div className="nine columns">
                  <input type="text" id="editPickupContactNumber" defaultValue={this.state.pickupContactNumber}></input>
                </div>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Address</strong>
                </div>
                <div className="nine columns">
                  {this.state.pickupAddress}, <br/>
                  Singapore {this.state.pickupPostalCode}
                </div>
              </div>

              <div className="row">
                <div className="three columns">
                <strong>Date</strong>
                </div>
                <div className="nine columns">
                    {this.state.pickupTimeDate.slice(0,10)}
                </div>
              </div>

              <div className="row">
                <div className="three columns">
                <strong>Time</strong>
                </div>
                <div className="nine columns">
                  <p>
                    {this.state.pickupTimeDate.slice(11,16)}
                  </p>
                </div>
              </div>

            </div>

            <div className="five columns">
              <h5>Dropoff</h5>
              <div className="row">
                <div className="three columns">
                <strong>Name</strong>
                </div>
                <div className="nine columns">
                  <input type="text" id="editDropoffContactName" defaultValue={this.state.dropoffContactName}></input>
                </div>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Contact</strong>
                </div>
                <div className="nine columns">
                  <input type="text" id="editDropoffContactNumber" defaultValue={this.state.dropoffContactNumber}></input>
                </div>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Address</strong>
                </div>
                <div className="nine columns">
                  {this.state.dropoffAddress}, <br/>
                  Singapore {this.state.dropoffPostalCode}
                </div>
              </div>

              <div className="row">
                <div className="three columns">
                <strong>Date</strong>
                </div>
                <div className="nine columns">
                    {this.state.dropoffTimeDate.slice(0,10)}
                </div>
              </div>

              <div className="row">
                <div className="three columns">
                <strong>Time</strong>
                </div>
                <div className="nine columns">
                  <p>
                    {this.state.dropoffTimeDate.slice(11,16)}
                  </p>
                </div>
              </div>


            </div>
            <div className="row">
              {this.acceptedByCourier()}
            </div>
          </div>
        </div>
      )
    }
  }
})











var GMap = React.createClass({
  getInitialState: function () {
    function midpoint(lat1, long1, lat2, long2) {
       return {lat: (lat1 + (lat2 - lat1)), lng: (long1 + (long2 - long1))};
  }
    return {
      pickup: { lat: 1.307063, lng: 103.819973 },
      dropoff: { lat: 1.309507, lng: 103.895117 },
      courier: { lat: 1.306686, lng: 103.862452 },
      midpoint: midpoint(1.307063,103.819973,1.309507,103.895117),
      zoom: 13,
    }
  },
  render: function () {
    return (
      <div className="GMap">
        <div className='GMap-canvas' ref="mapCanvas">
        </div>
      </div>
    );
  },
  componentDidMount: function(){
    this.map = this.createMap()
    this.marker = this.createMarker()
    this.dropoffMarker = this.createDropoffMarker()
    this.courierMarker = this.createCourierMarker()
    this.pickupMarker = this.createPickupMarker()
    this.pickupMarker = this.createCourierMarker()
    this.infoWindowPickup = this.createInfoWindowPickup()
    this.infoWindowForDropoff = this.createInfoWindowForDropoff()
    this.infoWindowForCourier = this.createInfoWindowForCourier()
    google.maps.event.addListener(this.map, 'zoom_changed', ()=> this.handleZoomChange())
  },
  componentDidUnMount: function(){
    google.maps.event.clearListeners(map, 'zoom_changed')
  },
  createMap: function(){
    let mapOptions = {
      zoom: this.state.zoom,
      center: this.mapCenter()
    }
    return new google.maps.Map(this.refs.mapCanvas, mapOptions)
  },
  mapCenter: function(){
    return new google.maps.LatLng(
      this.state.pickup.lat,
      this.state.pickup.lng
    )
  },
  dropoffPoint: function(){
    return new google.maps.LatLng(
      this.state.dropoff.lat,
      this.state.dropoff.lng
    )
  },
  pickupPoint: function(){
    return new google.maps.LatLng(
      this.state.pickup.lat,
      this.state.pickup.lng
    )
  },
  courierPoint: function(){
    return new google.maps.LatLng(
      this.state.courier.lat,
      this.state.courier.lng
    )
  },
  createMarker: function(){
    return new google.maps.Marker({
      position: this.mapCenter(),
      map: this.map
    })
  },
  createDropoffMarker: function(){
    return new google.maps.Marker({
      position: this.dropoffPoint(),
      map: this.map
    })
  },
  createPickupMarker: function(){
    return new google.maps.Marker({
      position: this.pickupPoint(),
      map: this.map
    })
  },
  createCourierMarker: function(){
    var image = 'http://i77.photobucket.com/albums/j55/Nolamom/Fun%20gifs/Christmas%20Gifs/running_reindeer.gif~original'

    return new google.maps.Marker({
      position: this.courierPoint(),
      map: this.map,
      icon: image,
    })
  },
  createInfoWindowForDropoff: function(){
    let contentString = "<div class='InfoWindow'>Dropoff</div>"
    return new google.maps.InfoWindow({
      map: this.map,
      anchor: this.dropoffMarker,
      content: contentString
    })
  },
  createInfoWindowPickup: function(){
    let contentString = "<div class='InfoWindow'>Pickup</div>"
    return new google.maps.InfoWindow({
      map: this.map,
      anchor: this.marker,
      content: contentString
    })
  },
  createInfoWindowForCourier: function(){
    let contentString = "<div class='InfoWindow'>Courier</div>"
    return new google.maps.InfoWindow({
      map: this.map,
      anchor: this.courierMarker,
      content: contentString,
    })
  },
  handleZoomChange: function(){
    this.setState({
      zoom: this.map.getZoom()
    })
  }
});













if(document.getElementById('clientManage') !== null){
  render(<ClientManage/>, document.getElementById('clientManage'));
}

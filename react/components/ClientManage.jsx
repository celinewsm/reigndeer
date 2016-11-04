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
          <h3 className="top-margin white-font">Jobs Ordered</h3>
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
          <p className="tiny-bottom-margin">{this.state.courierDetails.name} will be making the delivery and can be contacted at {this.state.courierDetails.mobile}.</p>
        </div>
      )
  }
},
insertGMap: function(){
  console.log("this.state.courierCurrentLatitude",this.state.courierCurrentLatitude)
  if(this.state.courierCurrentLatitude !== null){
    return (
      <div className="row">
        <div className="ten columns offset-by-one">

          <GMap pickupLatitude={this.state.pickupLatitude}
                pickupLongitude={this.state.pickupLongitude}
                dropoffLatitude={this.state.dropoffLatitude}
                dropoffLongitude={this.state.dropoffLongitude}
                courierCurrentLatitude={this.state.courierCurrentLatitude}
                courierCurrentLongitude={this.state.courierCurrentLongitude} />
        </div>
      </div>
    )
  }

},
ifCanCancel: function(){

  if (this.state.status === "Pending"){
    return  <div className="inline-block"><button type="button" name="button" onClick={() => this.props.cancelJob(this.state.id)} >Cancel</button></div>
  }
},
classForStatus: function(){
  if (this.state.status === "Pending"){
    return "tiny-top-margin zero-paddings zero-margins status-font-size grey-font"
  } else if (this.state.status === "Accepted") {
    return "tiny-top-margin zero-paddings zero-margins status-font-size blue-font"
  } else if (this.state.status === "Completed"){
    return "tiny-top-margin zero-paddings zero-margins status-font-size"
  } else {
    return "tiny-top-margin zero-paddings zero-margins status-font-size green-font"
  }
},
render: function(){
    if (!this.state.editing){
      return (
        <div className="row white-box">

          <div className="row">
            <div className="ten columns offset-by-one">
              <p className="tinyfont">ID1300{this.state.id}</p>
              <p className={this.classForStatus()}>{this.state.status}</p>
            </div>
          </div>
          {this.insertGMap()}
           <div className="row">
            <div className="five columns offset-by-one top-bottom-padding">
              <p className="tiny-margin"><strong>Pickup</strong></p>
              <p className="tiny-margin">{this.state.pickupContactName}</p>
              <p className="tiny-margin">{this.state.pickupContactNumber}</p>
              <p className="tiny-margin">{this.state.pickupAddress}</p>
              <p className="tiny-margin">Singapore {this.state.pickupPostalCode}</p>
              <p className="tiny-margin">{this.state.pickupTimeDate.slice(0,10)} {this.state.pickupTimeDate.slice(11,16)}</p>
            </div>
             <div className="five columns top-bottom-padding">
              <p className="tiny-margin"><strong>Dropoff</strong></p>
              <p className="tiny-margin">{this.state.dropoffContactName}</p>
              <p className="tiny-margin">{this.state.dropoffContactNumber}</p>
              <p className="tiny-margin">{this.state.dropoffAddress}</p>
              <p className="tiny-margin">Singapore {this.state.dropoffPostalCode}</p>
              <p className="tiny-margin">{this.state.dropoffTimeDate.slice(0,10)} {this.state.dropoffTimeDate.slice(11,16)}</p>
             </div>
            </div>

            <div className="row">
              {this.acceptedByCourier()}
             </div>

             <div className="row">
              <div className="ten columns offset-by-one text-align-center tiny-top-margin">
                <button type="button" name="button" onClick={() => this.toggleEdit()} >Edit</button>
                {this.ifCanCancel()}
              </div>
             </div>
            </div>
      )
    }
    else {
      return (


        <div className="row white-box">

          <div className="row">
            <div className="ten columns offset-by-one">
              <p className="tinyfont">ID1300{this.state.id}</p>
              <p className={this.classForStatus()}>{this.state.status}</p>
            </div>
          </div>
          {this.insertGMap()}
           <div className="row">
            <div className="five columns offset-by-one top-bottom-padding">
              <p className="tiny-margin"><strong>Pickup</strong></p>
              <p className="tiny-margin"><input type="text" id="editPickupContactName" defaultValue={this.state.pickupContactName}></input></p>
              <p className="tiny-margin"><input type="text" id="editPickupContactNumber" defaultValue={this.state.pickupContactNumber}></input></p>
              <p className="tiny-margin">{this.state.pickupAddress}</p>
              <p className="tiny-margin">Singapore {this.state.pickupPostalCode}</p>
              <p className="tiny-margin">{this.state.pickupTimeDate.slice(0,10)} {this.state.pickupTimeDate.slice(11,16)}</p>
            </div>
             <div className="five columns top-bottom-padding">
              <p className="tiny-margin"><strong>Dropoff</strong></p>
              <p className="tiny-margin"><input type="text" id="editDropoffContactName" defaultValue={this.state.dropoffContactName}></input></p>
              <p className="tiny-margin"><input type="text" id="editDropoffContactNumber" defaultValue={this.state.dropoffContactNumber}></input></p>
              <p className="tiny-margin">{this.state.dropoffAddress}</p>
              <p className="tiny-margin">Singapore {this.state.dropoffPostalCode}</p>
              <p className="tiny-margin">{this.state.dropoffTimeDate.slice(0,10)} {this.state.dropoffTimeDate.slice(11,16)}</p>
             </div>
            </div>

            <div className="row">
              {this.acceptedByCourier()}
             </div>

             <div className="row">
              <div className="ten columns offset-by-one text-align-center tiny-top-margin">
                <button type="button" name="button" onClick={() => this.saveState()} >Save</button>
                <button type="button" name="button" onClick={() => this.toggleEdit()} >Close Edit</button>
              </div>
             </div>


            </div>

      )
    }
  }
})

var GMap = React.createClass({
  getInitialState: function () {

  if (this.props.courierCurrentLatitude !== null){
    return {
      pickup: { lat: this.props.pickupLatitude, lng: this.props.pickupLongitude },
      dropoff: { lat: this.props.dropoffLatitude, lng: this.props.dropoffLongitude },
      courier: { lat: this.props.courierCurrentLatitude, lng: this.props.courierCurrentLongitude },
      midpoint: midpoint(this.props.pickupLatitude,this.props.pickupLongitude,this.props.dropoffLatitude,this.props.courierCurrentLongitude),
      zoom: 13,
    }
  } else {
    return {
      pickup: { lat: this.props.pickupLatitude, lng: this.props.pickupLongitude },
      dropoff: { lat: this.props.dropoffLatitude, lng: this.props.dropoffLongitude },
      midpoint: midpoint(this.props.pickupLatitude,this.props.pickupLongitude,this.props.dropoffLatitude,this.props.courierCurrentLongitude),
      zoom: 13,
    }
  }
  },
  componentWillReceiveProps: function(nextProps) {

    if (nextProps.courierCurrentLatitude !== null){

      this.setState({
        pickup: { lat: nextProps.pickupLatitude, lng: nextProps.pickupLongitude },
        dropoff: { lat: nextProps.dropoffLatitude, lng: nextProps.dropoffLongitude },
        courier: { lat: nextProps.courierCurrentLatitude, lng: nextProps.courierCurrentLongitude },
        midpoint: midpoint(nextProps.pickupLatitude,nextProps.pickupLongitude,nextProps.dropoffLatitude,nextProps.courierCurrentLongitude),
      });
    } else {
      this.setState({
        pickup: { lat: nextProps.pickupLatitude, lng: nextProps.pickupLongitude },
        dropoff: { lat: nextProps.dropoffLatitude, lng: nextProps.dropoffLongitude },
        midpoint: midpoint(nextProps.pickupLatitude,nextProps.pickupLongitude,nextProps.dropoffLatitude,nextProps.courierCurrentLongitude),
      });
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
    this.pickupMarker = this.createPickupMarker()
    this.infoWindowPickup = this.createInfoWindowPickup()
    this.infoWindowForDropoff = this.createInfoWindowForDropoff()
    if (this.state.courier !== undefined){
      this.courierMarker = this.createCourierMarker()
      this.infoWindowForCourier = this.createInfoWindowForCourier()
    }
    google.maps.event.addListener(this.map, 'zoom_changed', ()=> this.handleZoomChange())
  },
  componentDidUpdate: function(){

    if (this.state.courier !== undefined){
      this.courierMarker.setMap(null)
      this.infoWindowForCourier.setMap(null)
      this.courierMarker = this.createCourierMarker()
      this.infoWindowForCourier = this.createInfoWindowForCourier()
    }
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
    var image = 'http://i77.photobucket.com/albums/j55/Nolamom/Fun%20gifs/Christmas%20Gifs/running_reindeer.gif~https://res.cloudinary.com/celinewsm/image/upload/v1478223068/running_reindeer_guqhwr.gif'

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




function midpoint(lat1, long1, lat2, long2) {
   return {lat: (lat1 + (lat2 - lat1)), lng: (long1 + (long2 - long1))};
}

if(document.getElementById('clientManage') !== null){
  render(<ClientManage/>, document.getElementById('clientManage'));
}

import React from 'react';
import {render} from 'react-dom';

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

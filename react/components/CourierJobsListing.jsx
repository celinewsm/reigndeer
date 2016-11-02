import React from 'react';
import {render} from 'react-dom';

import io from 'socket.io-client'
let socket = io(window.location.host)


var CourierJobsListing = React.createClass({
  getInitialState: function () {
    return {
      initialJobs: jobsAvailable,
      jobs: []
    }
  },
  componentWillMount: function () {
    this.setState({jobs: this.state.initialJobs})
  },
  componentDidMount: function(){
    socket.emit('courier join channels', currentUserCourier.id);
  },
  render: function () {
    return (
      <div className="container">
        <div className="row text-align-center">
          <h1>Jobs Available</h1>
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
    return {
      id: this.props.job.id,
      clientId: this.props.job.clientId,
      courierId: this.props.job.courierId, // to be assigned later
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
      price: this.props.job.price
    }
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps);
},
render: function(){
      return (
        <div className="row" style={{"border": "1px solid black",
                                "padding": "1em",
                              "marginBottom": "1.5em"}}>
        <div className="row">
            <div className="five columns offset-by-one">
              <h5>JobID: 1300{this.state.id}</h5>
            </div>
            <div className="five columns">
              <button type="button" name="button" onClick={() => this.acceptJob()} >Accept</button>
            </div>
          </div>
          <div className="row">
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
          </div>
        </div>
      )
  }
})


if(document.getElementById('courierJobsListing') !== null){
  render(<CourierJobsListing/>, document.getElementById('courierJobsListing'));
}

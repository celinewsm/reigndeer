import React from 'react';
import {render} from 'react-dom';



class ClientManage extends React.Component {
  render () {
    return (
      <div className="container">
        <div className="row text-align-center">
          <h1>manage.ejs</h1>
        </div>


        <div className="row" style={{"border": "1px solid black",
                                "padding": "1em",
                              "margin-bottom": "1.5em"}}>
        <div className="row">
            <div className="one-half column text-align-center">
              <h5>
                JobID:123 | Status:Pending
              </h5>
            </div>
            <div className="one-half column text-align-center">
              <button type="button" name="button">Edit</button>
              <button type="button" name="button">Cancel</button>
            </div>
          </div>
          <div className="row">
          </div>
          <div className="row">
            <div className="six columns">
              <div className="row">
                  <h5>Pickup</h5>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Name</strong>
                </div>
                <div className="nine columns">
                  nameHere
                </div>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Contact</strong>
                </div>
                <div className="nine columns">
                  contacteHere
                </div>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Address</strong>
                </div>
                <div className="nine columns">
                  This should be a proper address, <br/>
                  Singapore + PostalCode
                </div>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Date & Time</strong>
                </div>
                <div className="nine columns">
                  <p>
                    2016-12-01 08:00
                  </p>
                </div>
              </div>
            </div>

            <div className="six columns">
              <h5>Dropoff</h5>
              <div className="row">
                <div className="three columns">
                <strong>Name</strong>
                </div>
                <div className="nine columns">
                  nameHere
                </div>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Contact</strong>
                </div>
                <div className="nine columns">
                  contacteHere
                </div>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Address</strong>
                </div>
                <div className="nine columns">
                  This should be a proper address too, <br/>
                  Singapore + PostalCode
                </div>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Date & Time</strong>
                </div>
                <div className="nine columns">
                  <p>
                    2016-12-01 08:00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="row" style={{"border": "1px solid black",
                                "padding": "1em",
                              "margin-bottom": "1.5em"}}>
        <div className="row">
            <div className="one-half column text-align-center">
              <h5>
                JobID:123 | Status:Pending
              </h5>
            </div>
            <div className="one-half column text-align-center">
              <button type="button" name="button">Edit</button>
              <button type="button" name="button">Cancel</button>
            </div>
          </div>
          <div className="row">
          </div>
          <div className="row">
            <div className="six columns">
              <div className="row">
                  <h5>Pickup</h5>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Name</strong>
                </div>
                <div className="nine columns">
                  nameHere
                </div>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Contact</strong>
                </div>
                <div className="nine columns">
                  contacteHere
                </div>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Address</strong>
                </div>
                <div className="nine columns">
                  This should be a proper address, <br/>
                  Singapore + PostalCode
                </div>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Date & Time</strong>
                </div>
                <div className="nine columns">
                  <p>
                    2016-12-01 08:00
                  </p>
                </div>
              </div>
            </div>

            <div className="six columns">
              <h5>Dropoff</h5>
              <div className="row">
                <div className="three columns">
                <strong>Name</strong>
                </div>
                <div className="nine columns">
                  nameHere
                </div>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Contact</strong>
                </div>
                <div className="nine columns">
                  contacteHere
                </div>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Address</strong>
                </div>
                <div className="nine columns">
                  This should be a proper address too, <br/>
                  Singapore + PostalCode
                </div>
              </div>
              <div className="row">
                <div className="three columns">
                <strong>Date & Time</strong>
                </div>
                <div className="nine columns">
                  <p>
                    2016-12-01 08:00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>


    </div>
    );
  }
}

if(document.getElementById('clientManage') !== null){
  render(<ClientManage/>, document.getElementById('clientManage'));
}

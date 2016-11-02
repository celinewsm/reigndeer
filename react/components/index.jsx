import React from 'react';
import {render} from 'react-dom';

import io from 'socket.io-client'
let socket = io(window.location.host)


import ClientManage from './ClientManage.jsx';
import CourierManage from './CourierManage.jsx';



class App extends React.Component {
  render () {
    return <p> Hello React!</p>;
  }
}

if(document.getElementById('app') !== null){
  render(<App/>, document.getElementById('app'));
}

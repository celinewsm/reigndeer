import React from 'react';
import {render} from 'react-dom';

class App extends React.Component {
  render () {
    return <p> Hello React!</p>;
  }
}

if(document.getElementById('app') !== null){
  render(<App/>, document.getElementById('app'));
}

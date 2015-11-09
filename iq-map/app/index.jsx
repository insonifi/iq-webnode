import React from 'react';
import ReactDOM from 'react-dom';
import {Provider}from 'react-redux';
import {Router, Route} from 'react-router';
import MapStore from './stores/MapStore';
import App from './components/Map';
import Dash from './components/Dash';
import MapConfig from './utils/MapConfig';

require('./less/main.less');

MapConfig('map.csv');

ReactDOM.render(
  <Provider store={MapStore}>
    <Router>
      <Route path="/map" component={Map} />
      <Route path="/dash" component={Dash} />
    </Router>
  </Provider>,
  document.getElementById('app')
);

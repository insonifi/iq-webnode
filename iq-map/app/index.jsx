import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import {Provider}from 'react-redux';
import MapStore from './stores/MapStore';
import Map from './components/Map';
import Dash from './components/Dash';
import MapConfig from './utils/MapConfig';

require('./less/main.less');

MapConfig('map.csv');

let history = createBrowserHistory({
  queryKey: false
})

ReactDOM.render(
  <Provider store={MapStore}>
    <Router history={history}>
      <Route path="/" component={Dash} />
      <Route path="/map" component={Map} />
    </Router>
  </Provider>,
  document.getElementById('app')
);

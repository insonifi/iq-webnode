/** @jsx React.DOM */ 

var React = require('react'),
CamList = require('./components/CamList.react'),
EventView = require('./components/EventView.react'); 
React.renderComponent( 
  <CamList />, 
  document.getElementById('camlist') 
); 
React.renderComponent( 
  <EventView />, 
  document.getElementById('events') 
); 

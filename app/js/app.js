/** @jsx React.DOM */ 

var React = require('react'),
CamList = require('./components/CamList.react'); 
React.renderComponent( 
  <CamList />, 
  document.getElementById('camlist') 
); 

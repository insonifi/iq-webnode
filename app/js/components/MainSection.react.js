/** @jsx React.DOM */ 

var React = require('react'),
CamItem = require('./CamItem'),
MainSection = React.createClass({
  render: function () {
        var allCams = this.props.allCams,
        camlist = [],
        key;
        
    for (key in allCams) { 
      camlist.push(<CamItem key={key} cam={allCams[key]} />); 
    } 

    return (
      <ul id="cam-list">{camlist}</ul>
    );
  } 
});

module.exports = MainSection;

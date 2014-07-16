/** @jsx React.DOM */ 

var React = require('react'),
CamItem = require('./CamItem'),
MainSection = React.createClass({
  render: function () {
        var camList = this.props.camList,
        camlist = [],
        key;
    for (key in camList) { 
      camlist.push(<CamItem key={key} cam={camList[key]} />); 
    } 

    return (
      <ul id="cam-list">{camlist}</ul>
    );
  } 
});

module.exports = MainSection;


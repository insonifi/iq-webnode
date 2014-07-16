/** @jsx React.DOM */ 

var React = require('react'),
CamActions = require('../actions/CamActions'),
CamItemSnapshot = require('./CamItemSnapshot'),
CamItem = React.createClass({
  propTypes: {
    cam: React.PropTypes.object.isRequired
  },
  render: function () {
    var cam = this.props.cam;
    
    return (
      <li>
        <span>[{cam.id}]</span><span>{cam.params.name}</span>
        <button onClick={this._onClick}>snapshot</button>
        <CamItemSnapshot frame={cam.frame} />
      </li>
    );
  },
  _onClick: function () {
    CamActions.getSnapshot(this.props.cam.id);
  }
})

module.exports = CamItem;

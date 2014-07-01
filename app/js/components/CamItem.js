/** @jsx React.DOM */ 

var React = require('react'),
CamActions = require('../actions/CamActions'),
CamItem = React.createClass({
  propTypes: {
    cam: React.PropTypes.object.isRequired
  },
  render: function () {
    var cam = this.props.cam;
    return (
      <li onClick={this._onPingClick}>[{cam.id}] {cam.params.name}</li>
    );
  },
  _onPingClick: function () {
    CamActions.pingCam(this.props.cam.ip);
  }
})

module.exports = CamItem;

/** @jsx React.DOM */ 

var React = require('react'),
CamItemSnapshot = React.createClass({
  propTypes: {
    frame: React.PropTypes.string.isRequired
  },
  render: function () {
    var frame = this.props.frame,
      uri = "data:image/jpeg;base64,";
    if (frame) {
      uri += frame;
    } else {
      uri = '';
    }
    
    return (
        <img src={uri}></img>
    );
  }
})

module.exports = CamItemSnapshot;

'use strict'
var React = require('react');
var Image = React.createClass({
  getInitialState: function () {
    return {}
  },
  displayName: 'Image',
  componentDidMount: function () {
  },
  render: function () {
    var config = this.props.config;
    var x = config.x;
    var y = config.y;
    var h = config.h;
    var w = config.w;
    var url = config.url;
    var style = {
        top: x,
        left: y,
        width: w,
        height: h
      };
        
    return <img className='image' style={style} src={url} />;
  }
})
module.exports = Image;
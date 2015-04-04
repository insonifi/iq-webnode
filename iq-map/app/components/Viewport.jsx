'use strict'
var React = require('react');
var _ = require('lodash');

var Viewport = React.createClass({
  getInitialState: function () {
    return {
    }
  },
  displayName: 'Viewport',
  componentDidMount: function () {
  },
  render: function () {
    var style = {
      width: '100%',
      height: '100%',
      position: 'absolute',
      overflow: 'hidden'
    }
    return <div style={style}>
      {this.props.children}
    </div>
  },
  

  
});

module.exports = Viewport;

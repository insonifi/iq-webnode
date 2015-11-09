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
    return <div className='viewport'>
      {this.props.children}
    </div>
  },



});

module.exports = Viewport;

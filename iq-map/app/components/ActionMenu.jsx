'use strict'
var React = require('react');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var RaisedButton = require('material-ui').RaisedButton;
var _ = require('lodash');

var ActionMenu = React.createClass({
  getInitialState: function () {
    return {
      isVisible: false
    }
  },
  displayName: 'ActionMenu',
  componentDidMount: function () {
  },
  render: function () {
    var _actions = _(this.props.actions);
    var i = this.props.actions.length;
    var radius = (i*25);
    var angularInterval = 2*Math.PI/i;
    var isVisible = this.state.isVisible;
    var containerStyle = {
      position: 'absolute',
      display: isVisible ? 'inline-block' : 'none',
      left:  0,
      top: 0,
    };
    var children = isVisible ? _actions.map(function (action) {
      var itemStyle = {
        position: 'absolute',
        left:  Math.sin(angularInterval * (i - 1)) * radius,
        top: Math.cos(angularInterval * (i - 1)) * radius,
        transform: 'translate(-50%, -50%)',
      };
      i -= 1;

      return (
        <div style={itemStyle} key={i}>
          <RaisedButton label={action.label} onClick={action.handler} />
        </div>
      )
    }).value() : null;
    
    return (
      <div style={containerStyle} onClick={this.close}>
          {children}
      </div>
    )
  },
  open: function () {
    this.setState({isVisible: true});
  },
  close: function () {
    this.setState({isVisible: false});
  },
  toggle: function () {
    this.setState({isVisible: !this.state.isVisible});
  }
});

module.exports = ActionMenu;

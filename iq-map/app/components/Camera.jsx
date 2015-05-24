'use strict'
var React = require('react');
var cx = require('classnames');
var {Paper, IconButton} = require('material-ui');
var ActionMenu = require('../components/ActionMenu');
var MapStore = require('../stores/MapStore');
var ObjectAction = require('../actions/ObjectActionCreators.js');

var timeout = 1000;


var Camera = React.createClass({
  getInitialState: function () {
    return {}
  },
  displayName: 'Camera',
  componentDidMount: function () {
    MapStore.addStateUpdateListener(this._onUpdate);
    this._onUpdate();
  },
  componentWillUnmount: function () {
    MapStore.removeStateUpdateListener(this._onUpdate);
  },
  render: function () {
    var config = this.props.config;
    var x = config.x;
    var y = config.y;
    var name = this.props.name;
    var state = this.state;
    var style = {
      position: 'absolute',
      top: y,
      left: x,
      transform: 'translate(-50%, -50%)',
    };
    var classes = cx('camera', {
        alarm: state.Alarmed,
      });
    var actions = this.actions('CAM', config.id);
    return  <Paper style={style} circle={true} className='icon'>
      <IconButton
          className={classes}
          tooltip={name}
          onClick={this.toggleMenu}>
      </IconButton>
      <ActionMenu ref='actionMenu' x={x} y={y} actions={actions} />
    </Paper>
  },
  
  actions: function (type, id) {
    return [
      {
        label: 'Arm',
        handler: function () { ObjectAction.send({type: type, id: id, action: 'ARM'}); }
      },
      {
        label: 'Disarm',
        handler: function () { ObjectAction.send({type: type, id: id, action: 'DISARM'});}
      },
      {
        label: 'Something',
        handler: function () { ObjectAction.log(Date.now()); }
      },
      {
        label: 'Something',
        handler: function () { ObjectAction.log(Date.now()); }
      }
    ]
  },
  
  _onUpdate: function () {
    this.replaceState(MapStore.getState('CAM', this.props.id));
  },
  
  toggleMenu: function () {
    this.refs.actionMenu.toggle();
  }
//  _onMouseEnter: function () {
//    var timer = setTimeout((function () {
//      this.refs.actionMenu.open();
//    }).bind(this), timeout);
//    this.setState({timer: timer});
//  },
//  
//  _onMouseLeave: function () {
//    clearTimeout(this.state.timer);
//  }
});

module.exports = Camera;
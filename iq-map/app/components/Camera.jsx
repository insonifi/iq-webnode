'use strict'
var React = require('react');
var cx = require('classnames');
var {Paper, IconButton} = require('material-ui');
var ActionMenu = require('../components/ActionMenu');
var MapStore = require('../stores/MapStore');
var ObjectAction = require('../actions/ObjectActionCreators.js');
var machina = require('machina');

var timeout = 1000;
var TYPE = 'CAM';

var CameraFsm = new machina.BehavioralFsm({
  namespace: TYPE,
  initialState: 'disarmed',
  states: {
    'disarmed': {
      'md_start': 'armed|alarmed',
      'md_stop': 'armed',
      'arm': 'armed',
    },
    'armed': {
      'md_start': 'armed|alarmed',
      'disarm': 'disarmed',
    },
    'armed|alarmed': {
      'md_stop': 'armed',
      'disarm': 'disarmed',
    },
  },
  init: function (client, state) {
    this.handle(client, state);
  },
});

var Camera = React.createClass({
  getInitialState: function () {
    return {}
  },
  displayName: TYPE,
  componentDidMount: function () {
    MapStore.addStateUpdateListener(this._onUpdate);
    this._onUpdate();
  },
  componentWillUnmount: function () {
    MapStore.removeStateUpdateListener(this._onUpdate);
  },
  render: function () {
    var x = this.props.x;
    var y = this.props.y;
    var id = this.props.id;
    var name = this.props.name;
    var state = this.state;
    var style = {
      position: 'absolute',
      top: y,
      left: x,
      transform: 'translate(-50%, -50%)',
      transition: 'none',
      '-webkit-transition': 'none',
      background: state.alarmed ? 'red' : 'white',
    };
    var actions = this.actions(TYPE, id);
    return  <Paper style={style} circle={true} className='icon'>
      <IconButton
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
        label: 'Get state',
        handler: function () { ObjectAction.requestState(type, id); }
      },
      {
        label: 'Something',
        handler: function () { ObjectAction.log(Date.now()); }
      }
    ]
  },
  
  _onUpdate: function () {
    var state = MapStore.getState(TYPE, this.props.id);
    this.replaceState(state);
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
MapStore.registerFactory(Camera);
MapStore.registerBehaviour(CameraFsm);
module.exports = Camera;
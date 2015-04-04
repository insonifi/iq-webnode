'use strict'
var React = require('react');
var cx = require('classnames');
var {Paper, SvgIcon, IconButton} = require('material-ui');
var ActionMenu = require('../components/ActionMenu');
var MapStore = require('../stores/MapStore');
var CameraAction = require('../actions/CameraActionCreators.js');

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
    var name = config.name;
    var state = this.state;
    var style = {
      position: 'absolute',
      top: y,
      left: x,
      transform: 'translate(-50%, -50%)'
    };
    var svgStyle = {
        opacity:1,
        fill:'none',
        fillOpacity:1,
        stroke: state.Armed ? '#ED7E12' : '#839EA0' ,
        strokeWidth:2,
        strokeLinecap:'round',
        strokeLinejoin:'bevel',
        strokeMiterlimit:4,
        strokeDasharray:'none',
        strokeDashoffset:0,
        strokeOpacity:1
      };
    var classes = cx({
        'icon-camera': true,
        alarm: state.Alarmed,
      });
    var actions = this.actions('CAM', config.id);
    return  <div style={style}>
      <Paper circle={true} className={classes}
              onClick={this.toggleMenu}>
        <IconButton tooltip={name}>
          <SvgIcon>
                <rect
                   ry='3'
                   y='4'
                   x='1'
                   height='16'
                   width='16'
                   style={svgStyle} />
                <rect
                   ry='0.15'
                   y='7'
                   x='19'
                   height='10'
                   width='4'
                   style={svgStyle} />
            </SvgIcon>
        </IconButton>
      </Paper>
      <ActionMenu ref='actionMenu' x={x} y={y} actions={actions} />
    </div>
  },
  
  actions: function (type, id) {
    return [
      {
        label: 'Arm',
        handler: function () { CameraAction.send({type: type, id: id, action: 'ARM'}); }
      },
      {
        label: 'Disarm',
        handler: function () { CameraAction.send({type: type, id: id, action: 'DISARM'});}
      },
      {
        label: 'Something',
        handler: function () { console.log(Date.now()); }
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
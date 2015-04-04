'use strict'
var React = require('react');
var _ = require('lodash');
var objectList = {
  CAM: React.createFactory(require('../components/Camera')),
  Image: React.createFactory(require('../components/Image'))
}
var tsf_template = _.template('translate(${x}px, ${y}px) scale(${scale})');
//var tsf_template = _.template('scale(${scale})');
var Layer = React.createClass({
  getInitialState: function () {
    return {
      isDragging: false,
      w: 0,
      h: 0,
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      scale: 1
    }
  },
  displayName: 'Layer',
  componentDidMount: function () {
  },
  render: function () {
    var description  = this.props.desc || {bg: "", config: []};
    var _config = _(description.config);
    var style = {
      position: 'absolute',
      transform: tsf_template({
        x: this.state.x  + this.state.dx,
        y: this.state.y + this.state.dy,
        scale: this.state.scale
      }),
      background: 'aliceblue'
    };
    var bg = {
      width: '100%',
      height: '100%'
    };
    
    return <div style={style}
      onMouseDown={this._startDrag}
      onMouseUp={this._stopDrag}
      onWheel={this._zoom} >
        
      <img src={description.bg} />
      {
        _config.map(function (obj) {
          return objectList[obj.type]({config: obj.config, id: obj.id, key: obj.type + obj.id});
        }).value()

      }
    </div>
  },                    
  _startDrag: function(e) {
    e.preventDefault();
    window.addEventListener('mousemove', this._Drag, true);
    
    var x = e.clientX - this.state.x;
    var y = e.clientY - this.state.y;
    this.setState({
      isDragging: true,
      ox: x,
      oy: y
    });
  },
  
  _stopDrag: function(e) {
    window.removeEventListener('mousemove', this._Drag, true);
  },
  
  _Drag: function (e) {
    var s = this.state.scale;
    var dx = e.clientX - this.state.ox;
    var dy = e.clientY - this.state.oy;
    this.setState({
      x: dx,
      y: dy,
    });
  },
  
  _zoom: function (e) {
    var s = Math.sign(e.deltaY);
    var dscale = 0.1;
    var oscale = this.state.scale;
    var nscale = oscale + dscale * s;
    if (nscale > this.props.maxZoom || nscale < this.props.minZoom) {
      return;
    }
    var rect = e.currentTarget.getBoundingClientRect();
    var w = rect.width / oscale;
    var h = rect.height / oscale;
    var x = rect.left / oscale;
    var y = rect.top / oscale;
    var rx = (e.clientX / oscale) - x;
    var ry = (e.clientY / oscale) - y;
    var dx = (dscale * w) * s * (0.5 - rx/w);
    var dy = (dscale * h) * s * (0.5 - ry/h);
    this.setState({
      scale: nscale,
      dx: this.state.dx + dx,
      dy: this.state.dy + dy,
    });
  }                          
});

module.exports = Layer;

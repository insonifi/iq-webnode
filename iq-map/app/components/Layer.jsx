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
      scale: 0,
      minScale: 0,
      tscale: 1
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
      transformOrigin: '0 0',
      transform: tsf_template({
        x: this.state.x  + this.state.dx,
        y: this.state.y + this.state.dy,
        scale: this.state.tscale
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
      
      <img src={description.bg} onLoad={this.fit}/>
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
    //stop drag if mouse button was released
    if (e.which === 0) {
      this._stopDrag(e);
      return false;
    }
    var width = window.innerWidth;
    var height = window.innerHeight;
    var rect = React.findDOMNode(this).getBoundingClientRect();
    
    var s = this.state.scale;
    var dx = e.clientX - this.state.ox;
    var dy = e.clientY - this.state.oy;
    var deltaX = this.state.x - dx;
    var deltaY = this.state.y - dy;
    // Check bounds
    dx = Math.max(-this.state.dx + window.innerWidth - rect.width, dx);
    dy = Math.max(-this.state.dy + window.innerHeight - rect.height, dy);
    dx = Math.min(-this.state.dx, dx);
    dy = Math.min(-this.state.dy, dy);
    this.setState({
      x: dx,
      y: dy,
    });
  },
  
  _zoom: function (e) {
    var s = -Math.sign(e.deltaY);
    var otscale = this.state.tscale;
    var scale = this.state.scale + 0.1 * s;
    var tscale = Math.exp(scale);
    if (tscale > this.props.maxZoom || tscale < this.state.minScale) {
      return;
    }
    
    var dscale = Math.abs(otscale - tscale);
    var rect = e.currentTarget.getBoundingClientRect();
    var w = rect.width / otscale;
    var h = rect.height / otscale;
    var rx = Math.max((e.clientX - rect.left) / otscale, 0);
    var ry = Math.max((e.clientY - rect.top) / otscale, 0);
    var dx = (dscale * w) * s * ((0.5 - rx)/w) + this.state.dx;
    var dy = (dscale * h) * s * ((0.5 - ry)/h) + this.state.dy;
    
    var x = this.state.x;
    var y = this.state.y;
    var offsetX = x + dx;
    var offsetY = y + dy;
    
    var corr_x = 0;
    var corr_y = 0;
    
    var leftBound = offsetX;
    var topBound = offsetY;
    var rightBound = offsetX + w*tscale - window.innerWidth;
    var bottomBound = offsetY + h*tscale - window.innerHeight;
    if (s < 0) {
      if (leftBound > 0 || rightBound < 0) {
        corr_x = Math.max(leftBound, rightBound);
      }
      if (topBound > 0 || bottomBound < 0) {
        corr_y = Math.max(topBound, bottomBound);
      }
    }
    this.setState({
      scale,
      tscale,
      dx,
      dy,
      x: x - corr_x,
      y: y - corr_y,
    });
  },
  
  fit: function () {
    var node = this.getDOMNode();
    var rect = node.getBoundingClientRect();
    var tscale = Math.min(window.innerWidth / node.clientWidth, window.innerHeight / node.clientHeight);
    this.setState({
      scale: Math.log(tscale),
      minScale: tscale,
      tscale,
      x: 0,
      y: 0,
      dx: 0,
      dy: 0
    }); 
  }
});

module.exports = Layer;

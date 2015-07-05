'use strict'
var React = require('react');
var _ = require('lodash');
var MapStore = require('../stores/MapStore');
/**
 * Load object components
 * */
require('../components/Camera');

//var tsf_template = _.template('translate(${x}px, ${y}px) scale(${scale})');
var tsf_template = _.template('translate(-50%, -50%) scale(${scale})');
var bg_template = _.template('url(${bg}) white');
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
      cx: 0,
      cy: 0,
      scale: 0,
      minZoom: 0,
      tscale: 1
    }
  },
  displayName: 'Layer',
  componentDidMount: function () {
    this._getSize();
  },
  componentWillReceiveProps: function () {
    this._getSize();
  },
  render: function () {
    var desc  = this.props.desc || {bg: "", config: []};
    var _config = _(desc.config);
    var x = this.state.x;
    var y = this.state.y;
    var dx = this.state.dx;
    var dy = this.state.dy;
    var cx = this.state.cx;
    var cy = this.state.cy;
    var w = this.state.w;
    var h = this.state.h;
    var pos_x = x + dx + cx;
    var pos_y = y + dy + cy;
    var tscale = this.state.tscale;
    var style = {
      position: 'absolute',
//      transformOrigin: '0 0',
//      transform: tsf_template({
//        x: this.state.x  + this.state.dx,
//        y: this.state.y + this.state.dy,
//        scale: this.state.tscale
//      }),
      left: pos_x,
      top: pos_y,
      width: w * tscale,
      height: h * tscale,
      borderColor: 'lightskyblue',
      borderStyle: 'solid',
      borderWidth: 1,
//      background: bg_template(desc),
//      backgroundSize: 'cover',
//      backgroundRepeat: 'no-repeat',
    };
    var bg = {
      left: '50%',
      top: '50%',
      position: 'absolute',
//      width: '100%',
//      height: '100%',
      transform: tsf_template({
//        x: this.state.x  + this.state.dx,
//        y: this.state.y + this.state.dy,
        scale: this.state.tscale
      }),
    };
//      <img ref='Image' style={bg} src={desc.bg} onLoad={this.fit}/>
    return <div style={style}
      ref='Layer'
      onMouseDown={this._startDrag}
      onMouseUp={this._stopDrag} 
      onWheel={this._zoom} >
      {
        _config.map(function (obj) {
          var x = obj.x * tscale;
          var y = obj.y * tscale;
          var pos__x = pos_x + x;
          var pos__y = pos_y + y;
          if ((0 < pos__x && pos__x < window.innerWidth) &&
              (0 < pos__y && pos__y < window.innerHeight)) {
            return MapStore.getFactory(obj.type)({id: obj.id, key: obj.type + obj.id, x, y});
          } else {
            return null;
          }
        }).value()
      }
      <img src={desc.bg} style={bg} />
    </div>
  },                    
  _startDrag: function(e) {
    e.preventDefault();
    window.addEventListener('mousemove', this._drag, true);
    
    var x = e.clientX - this.state.x;
    var y = e.clientY - this.state.y;
    this.setState({
      isDragging: true,
      ox: x,
      oy: y
    });
  },
  
  _stopDrag: function(e) {
    window.removeEventListener('mousemove', this._drag, true);
  },
  
  _drag: function (e) {
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
    if (tscale > this.props.maxZoom || tscale < this.state.minZoom) {
      return;
    }
    
    var dscale = Math.abs(otscale - tscale);
    var rect = e.currentTarget.getBoundingClientRect();
    var w = rect.width / otscale;
    var h = rect.height / otscale;
    var ox = (e.clientX - rect.left) / otscale;
    var oy = (e.clientY - rect.top) / otscale;
    var rx = (ox / w);
    var ry = (oy / h);
    var dx = (s * dscale * w) * -rx + this.state.dx;
    var dy = (s * dscale * h) * -ry + this.state.dy;
    var x = this.state.x;
    var y = this.state.y;
    var cx = this.state.cx;
    var cy = this.state.cy;
    var offsetX = x + dx + cx;
    var offsetY = y + dy + cy;
    
    var leftEdge = offsetX;
    var rightEdge = -(offsetX + (w * tscale) - window.innerWidth);
    var topEdge = offsetY;
    var bottomEdge = -(offsetY + (h * tscale) - window.innerHeight);
    if (s < 0) {
      if (leftEdge > 0) {
        cx -= leftEdge;
      } else {
        if (rightEdge > 0) {
          cx += rightEdge;
        }
      }
      if (topEdge > 0) {
        cy -= topEdge;
      } else {
        if (bottomEdge > 0) {
          cy += bottomEdge;
        }
      }
    }
    
    this.setState({
      scale,
      tscale,
      dx,
      dy,
      cx,
      cy,
    });
  },
  _getSize: function () {
    var image = document.createElement('img');
    image.addEventListener('load', (function () {
      this.setState({
        w: image.width,
        h: image.height
      });
      this.fit();
    }).bind(this));
    image.src = this.props.desc.bg;
  },
  fit: function () {
    var tscale = Math.max(window.innerWidth / this.state.w, window.innerHeight / this.state.h);
    this.setState({
      scale: Math.log(tscale),
      minZoom: tscale,
      tscale,
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      cx: 0,
      cy: 0,
    }); 
  }
});

module.exports = Layer;

'use strict'
var React = require('react');
var _ = require('lodash');
var MapStore = require('../stores/MapStore');
var {updateLayerPosition, updateFrame} = require('../actions/MapActionCreators');
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
      w: 0,
      h: 0,
      x: 0,
      y: 0,
      scale: 1,
      minZoom: 0,
    }
  },
  displayName: 'Layer',
  componentDidMount: function () {
    MapStore.addLayerPositionChange(this.updatePosition);
    this._getSize();
  },
  componentWillUnmount: function () {
    MapStore.removeLayerPositionChange(this.updatePosition);
  },
  componentWillReceiveProps: function () {
    this._getSize();
  },
  componentDidUpdate: function () {
    /* TODO: Called multiple times on layer change */
    var b = React.findDOMNode(this).getBoundingClientRect();
    var rel_l = Math.max(-b.left, 0)/b.width;
    var rel_t = Math.max(-b.top, 0)/b.height;
    var rel_r = Math.max(b.right - window.innerWidth, 0)/b.width;
    var rel_b = Math.max(b.bottom - window.innerHeight, 0)/b.height;
    updateFrame({
      l: rel_l,
      t: rel_t,
      r: rel_r,
      b: rel_b,
    });
  },
  render: function () {
    var desc = this.props.desc || {bg: '', config: []};
    var _config = _(desc.config);
    var pos_x = this.state.x;
    var pos_y = this.state.y;
    var w = this.state.w;
    var h = this.state.h;
    var scale = this.state.scale;
    var style = {
      position: 'absolute',
      left: pos_x,
      top: pos_y,
      width: w * scale,
      height: h * scale,
      borderColor: 'lightskyblue',
      borderStyle: 'solid',
      borderWidth: 1,
    };
    var bg = {
      left: '50%',
      top: '50%',
      position: 'absolute',
      transform: tsf_template({
        scale,
      }),
    };
    return <div style={style}
      ref='Layer'
      onMouseMove={this._updateMarker}
      onMouseDown={this._startDrag}
      onMouseUp={this._stopDrag} 
      onWheel={this._zoom} >
      {
        _config.map(function (obj) {
          var x = obj.x * scale;
          var y = obj.y * scale;
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
    this.setState({
      ox: e.clientX,
      oy: e.clientY
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
    var x = this.state.x;
    var y = this.state.y;
    var ex = e.clientX;
    var ey = e.clientY;
    var dx = x + ex - this.state.ox;
    var dy = y + ey - this.state.oy;
    // Check bounds
    var {x, y} = this._boundedPosition(dx, dy);
    this.setState({
      ox: ex,
      oy: ey,
      x,
      y,
    });
  },
  _zoom: function (e) {
    var s = -Math.sign(e.deltaY);
    var {x, y, w, h, scale} = this.state;
    var oscale = scale;
    var scale = scale * (1 + 0.1 * s);
    if (scale > this.props.maxZoom || scale < this.state.minZoom) {
      return;
    }
    var dscale = oscale - scale;
    var rect = e.currentTarget.getBoundingClientRect();
    var ox = (e.clientX - x) / rect.width;
    var oy = (e.clientY - y) / rect.height;
    var dx = dscale * w * ox;
    var dy = dscale * h * oy;
    var offsetX = x + dx;
    var offsetY = y + dy;
    
    
    var leftEdge = offsetX;
    var rightEdge = -(offsetX + (w * scale) - window.innerWidth);
    var topEdge = offsetY;
    var bottomEdge = -(offsetY + (h * scale) - window.innerHeight);
    if (s < 0) {
      if (leftEdge > 0) {
        dx -= leftEdge;
      } else {
        if (rightEdge > 0) {
          dx += rightEdge;
        }
      }
      if (topEdge > 0) {
        dy -= topEdge;
      } else {
        if (bottomEdge > 0) {
          dy += bottomEdge;
        }
      }
    }
    this.setState({
      scale,
      x: x + dx,
      y: y + dy,
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
    var scale = Math.max(window.innerWidth / this.state.w, window.innerHeight / this.state.h);
    this.setState({
      minZoom: scale,
      x: 0,
      y: 0,
      scale,
    });
  },
  updatePosition: function () {
    var {w, h, scale} = this.state;
    var pos = MapStore.getLayerPosition();
    var scaledWidth = scale * w;
    var scaledHeight = scale * h;
    var _x = innerWidth * 0.5 - scaledWidth * pos.x;
    var _y = innerHeight * 0.5 - scaledHeight * pos.y;
    // Check bounds
    var {x, y} = this._boundedPosition(_x, _y);
    this.setState({
      x,
      y,
    });
  },
  _boundedPosition: function (_x, _y) {
    var x = _x;
    var y = _y;
    var s = this.state.scale;
    var scaledWidth = this.state.w * s;
    var scaledHeight = this.state.h * s;
    x = Math.min(x, 0);
    y = Math.min(y, 0);
    x = Math.max(x, innerWidth - scaledWidth);
    y = Math.max(y, innerHeight - scaledHeight);
    return {x, y};
  },
});

module.exports = Layer;

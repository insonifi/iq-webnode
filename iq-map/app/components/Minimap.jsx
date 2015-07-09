'use strict'
var React = require('react');
var scale = 1;
var Minimap = React.createClass({
  getInitialState: function () {
    return {
      x: 10,
      y: 10,
      ox: 0,
      oy: 0,
      w: 0,
      h: 0,
      s: 0.2,
      p: 3,
    }
  },
  displayName: 'Minimap',
  componentDidMount: function () {
    this.renderBg(this.props.desc.bg);
  },
  componentWillReceiveProps: function (newProps) {
    this.renderBg(newProps.desc.bg);
  },
  componentDidUpdate: function () {
    this.renderLayer();
  },
  componentWillUpdate: function () {
    // Subscribe to object state change
  },
  render: function () {
    var minimapStyle = {
      left: this.state.x + this.state.ox,
      top: this.state.y + this.state.oy,
      width: this.state.w * this.state.s,
      height: this.state.h * this.state.s,
    };
    return <div className='minimap' style={minimapStyle}
//    onDragStart={this._dragStart} 
//      onDragEnd={this._dragStop}
      onDrag={this._drag} >
      <canvas className='minimap-bg' ref='bg'/>
      <canvas className='minimap-layer' ref='layer' />
    </div>
  },
  _dragStart: function (e) {
  },
  _drag: function(e) {
    if ((e.pageX + e.pageY) > 0) {
      this.setState({
        x: e.pageX,
        y: e.pageY,
      });
    }
  },
  
  _dragStop: function(e) {
  },
  renderBg: function (src) {
    var bgcanvas = React.findDOMNode(this.refs.bg);
    var image = document.createElement('img');
    image.addEventListener('load', (function () {
      var scale = this.state.s
      this.setState({
        w: image.width,
        h: image.height,
      });
      bgcanvas.width = image.width * scale;
      bgcanvas.height = image.height * scale;
      var bgctx = bgcanvas.getContext('2d');
      bgctx.fillStyle = 'white';
      bgctx.fillRect(0, 0, image.width, image.height);
      bgctx.save();
      bgctx.scale(scale, scale);
      bgctx.drawImage(image, 0, 0);
      bgctx.restore();
      // save scale somewhere
      this.renderLayer();
    }).bind(this));
    image.src = src;
  },
  renderLayer: function () {
    var lcanvas = React.findDOMNode(this.refs.layer);
    var offscreen = document.createElement('canvas');
    var scale = this.state.s;
    var p = this.state.p
    offscreen.width = this.state.w;
    offscreen.height = this.state.h;
    lcanvas.width = this.state.w * scale;
    lcanvas.height = this.state.h * scale;
    var offctx = offscreen.getContext('2d');
    offctx.save();
    offctx.scale(scale, scale);
    _.forEach(this.props.desc.config, function (obj) {
      offctx.fillStyle = 'red';
      offctx.fillRect(obj.x, obj.y, p / scale, p / scale);
    });
    offctx.restore();
    var lctx = lcanvas.getContext('2d');
    lctx.drawImage(offscreen, 0, 0);
  }
});

module.exports = Minimap;
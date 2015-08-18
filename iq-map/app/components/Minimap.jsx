'use strict'
var React = require('react');
var MapStore = require('../stores/MapStore');
var {updateLayerPosition} = require('../actions/MapActionCreators');
var scale = 1;
var Minimap = React.createClass({
  getInitialState: function () {
    return {
      x: 10,
      y: 10,
      w: 0,
      h: 0,
      s: 0.2,
      p: 3,
      frame: {
        l: 0,
        t: 0,
        r: 0,
        b: 0,
      }
    }
  },
  displayName: 'Minimap',
  componentDidMount: function () {
    MapStore.addStateUpdateListener(this.renderLayer);
    MapStore.addFrameChangeListener(this.updateFrame);
    this.renderBg(this.props.desc.bg);
  },
  componentWillReceiveProps: function (newProps, oldProps) {
//    if (newProps !== oldProps) {
      this.renderBg(newProps.desc.bg);
//    }
  },
  componentDidUpdate: function () {
    this.renderLayer();
  },
  componentWillUpdate: function () {
    // Subscribe to object state change
  },
  componentWillUnmount: function () {
    MapStore.removeStateUpdateListener(this.renderLayer);
    MapStore.removeFrameChangeListener(this.updateFrame);
  },
  render: function () {
    var m_width = this.state.w * this.state.s;
    var m_height = this.state.h * this.state.s;
    var frame = this.state.frame;
    var frameColor = [
      parseInt(this.props.frameColor.slice(1,3), 16),
      parseInt(this.props.frameColor.slice(3,5), 16),
      parseInt(this.props.frameColor.slice(5,), 16)
    ];
    var minimapStyle = {
      left: this.state.x,
      top: this.state.y,
      width: m_width,
      height: m_height,
    };
    var frameStyle = {
      position: 'absolute',
      left: m_width * frame.l,
      top: m_height * frame.t,
      right: m_width * frame.r,
      bottom: m_height * frame.b,
      background: 'rgba($, 0.1)'.replace('$', frameColor),
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: this.props.frameColor,
      zIndex: 2,
    };
    return <div className='minimap' style={minimapStyle}>
      <canvas className='minimap-bg' ref='bg' />
      <canvas className='minimap-layer' ref='layer' onClick={this.sendPosition} />
      <div style={frameStyle} ref='frame' />
    </div>
  },
  _move: function(e) {
    var {pageX, pageY} = e;
    this._log(e);
    if ((pageX + pageY) > 0) {
      this.setState({
        x: pageX,
        y: pageY,
      });
    }
  },
  _log: function (e) {
    var {pageX, pageY} = e;
    console.log(pageX, pageY);
  },
  
  updateFrame: function () {
    this.setState({
      frame: MapStore.getFrame()
    });
  },
      
  sendPosition: function (e) {
    var scale = this.state.s;
    var x = (e.clientX - this.state.x) / (this.state.w * scale);
    var y = (e.clientY - this.state.y) / (this.state.h * scale);
    updateLayerPosition({
      x,
      y,
    });
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
      var state = MapStore.getState(obj.type, obj.id);
      
      offctx.fillStyle = state.alarmed ? 'red' : 'deepskyblue';
      offctx.fillRect(obj.x, obj.y, p / scale, p / scale);
    });
    offctx.restore();
    var lctx = lcanvas.getContext('2d');
    lctx.drawImage(offscreen, 0, 0);
  }
});

module.exports = Minimap;
'use strict'
var React = require('react');
var Draggable = require('react-draggable');
var {FlatButton} = require('material-ui');
var MapStore = require('../stores/MapStore');
var {updateLayerPosition} = require('../actions/MapActionCreators');
var scale = 1;
var Minimap = React.createClass({
  getInitialState: function () {
    return {
      w: 0,
      h: 0,
      s: 0.2,
      point: 3,
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
    var handleSize = 16;
    var handleStyle = {
      display: 'inline',
      minWidth: handleSize,
      height: m_height,
      left: -handleSize,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'rgba(0,0,0, 0.1)',
      zIndex: 2,
    };
    return <Draggable axis='both' start={{x: 10, y: 10}} handle='.handle'>
      <div className='minimap' style={minimapStyle}>
        <FlatButton className='handle dropshadow' style={handleStyle} />
        <canvas className='minimap-bg dropshadow' ref='bg' />
        <canvas className='minimap-layer' ref='layer' onClick={this.sendPosition} />
        <div style={frameStyle} ref='frame' />
      </div>
    </Draggable>
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
    var rect = React.findDOMNode(this).getBoundingClientRect();
    var x = (e.clientX - rect.left) / (this.state.w * scale);
    var y = (e.clientY - rect.top) / (this.state.h * scale);
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
      this.renderLayer();
    }).bind(this));
    image.src = src;
  },
  renderLayer: function () {
    var lcanvas = React.findDOMNode(this.refs.layer);
    var offscreen = document.createElement('canvas');
    var {s, point} = this.state
    offscreen.width = this.state.w;
    offscreen.height = this.state.h;
    lcanvas.width = this.state.w * s;
    lcanvas.height = this.state.h * s;
    var offctx = offscreen.getContext('2d');
    offctx.save();
    offctx.scale(s, s);
    _.forEach(this.props.desc.config, function (obj) {
      var state = MapStore.getState(obj.type, obj.id);
      
      offctx.fillStyle = state.alarmed ? 'red' : 'deepskyblue';
      offctx.fillRect(obj.x, obj.y, point / s, point / s);
    });
    offctx.restore();
    var lctx = lcanvas.getContext('2d');
    lctx.drawImage(offscreen, 0, 0);
  }
});

module.exports = Minimap;
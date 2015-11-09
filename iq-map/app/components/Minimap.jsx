'use strict'
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable'
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import FlatButton from 'material-ui/lib/flat-button';
import {getObjectState} from '../stores/MapStore';
import {updateLayerCentre} from '../actions/MapActionCreators';
let scale = 1;
class Minimap extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
    this.sendPosition = this.sendPosition.bind(this);
    this.renderBg = this.renderBg.bind(this);
    this.renderLayer = this.renderLayer.bind(this);
  }
  componentDidMount() {
    this.renderBg(this.props.desc.bg);
  }
  componentWillReceiveProps(newProps, oldProps) {
    this.renderBg(newProps.desc.bg);
  }
  componentDidUpdate() {
    this.renderLayer();
  }
  componentWillUpdate() {
  }
  componentWillUnmountfunction() {
  }
  render() {
    const { dispatch, frame, frameColor, layers } = this.props;
    const m_width = this.state.w * this.state.s;
    const m_height = this.state.h * this.state.s;
    const _frameColor = [
      parseInt(frameColor.slice(1,3), 16),
      parseInt(frameColor.slice(3,5), 16),
      parseInt(frameColor.slice(5,7), 16)
    ];
    const minimapStyle = {
      width: m_width,
      height: m_height,
    };
    const frameStyle = {
      left: m_width * frame.l,
      top: m_height * frame.t,
      right: m_width * frame.r,
      bottom: m_height * frame.b,
      background: `rgba($, 0.1)`.replace('$', _frameColor),
      borderColor: frameColor,
    };
    return <Draggable axis='both' start={{x: 20, y: 10}} handle='.handle'>
      <div className='minimap dropshadow' style={minimapStyle}>
        <div className='minimap__handle handle' />
        <canvas className='minimap__bg' ref='bg' />
        <canvas className='minimap__layer' ref='layer' onClick={this.sendPosition} />
        <div className='minimap__frame' style={frameStyle} ref='frame' />
      </div>
    </Draggable>
  }
  sendPosition(e) {
    let {clientX, clientY} = e;
    let {dispatch} = this.props;
    let {w, h, s} = this.state;
    let {left, top} = ReactDOM.findDOMNode(this).getBoundingClientRect();
    let x = (clientX - left) / (w * s);
    let y = (clientY - top) / (h * s);
    dispatch(updateLayerCentre({x, y,}));
  }

  renderBg(src) {
    let bgcanvas = this.refs.bg;
    let image = document.createElement('img');
    image.addEventListener('load', (function () {
      let scale = this.state.s
      this.setState({
        w: image.width,
        h: image.height,
      });
      bgcanvas.width = image.width * scale;
      bgcanvas.height = image.height * scale;
      let bgctx = bgcanvas.getContext('2d');
      bgctx.fillStyle = 'white';
      bgctx.fillRect(0, 0, image.width, image.height);
      bgctx.save();
      bgctx.scale(scale, scale);
      bgctx.drawImage(image, 0, 0);
      bgctx.restore();
      this.renderLayer();
    }).bind(this));
    image.src = src;
  }
  renderLayer() {
    let lcanvas = this.refs.layer;
    let {states} = this.props;
    let offscreen = document.createElement('canvas');
    let {w, h, s, point} = this.state
    offscreen.width = w;
    offscreen.height = h;
    lcanvas.width = w * s;
    lcanvas.height = h * s;
    let offctx = offscreen.getContext('2d');
    offctx.save();
    offctx.scale(s, s);
    _.forEach(this.props.desc.config, function ({type, id, x,y }) {
      let state = getObjectState(type, id);

      offctx.fillStyle = state.alarmed ? 'red' : 'deepskyblue';
      offctx.fillRect(x, y, point / s, point / s);
    });
    offctx.restore();
    let lctx = lcanvas.getContext('2d');
    lctx.drawImage(offscreen, 0, 0);
  }
};

const selector = createSelector(
  (state) => state.framePosition,
  (state) => state.objects.states,
  (frame, states) => ({
      frame,
      states,
    })
);

export default connect(selector)(Minimap);

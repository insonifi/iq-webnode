'use strict'
import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import Draggable from 'react-draggable'
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import FlatButton from 'material-ui/lib/flat-button';
import Paper from 'material-ui/lib/paper';
import {getObjectState} from '../stores/MapStore';
import {updateLayerCentre} from '../actions/MapActionCreators';
let scale = 1;
class Minimap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      s: 0.5,
      r: 1,
    }
    this.sendPosition = this.sendPosition.bind(this);
    this.updateBg = this.updateBg.bind(this);
    this.renderLayer = this.renderLayer.bind(this);
  }
  componentDidMount() {
  }
  componentWillReceiveProps(newProps, oldProps) {
  }
  componentDidUpdate() {
    this.renderLayer();
  }
  componentWillUpdate() {
  }
  componentWillUnmount() {
  }
  shouldComponentUpdate() {
  }
  render() {
    const { dispatch, framePosition, frameColor, desc,
            layers, width, height, showObj} = this.props;
    const {l, t, w, h} = framePosition;
    const {r} = this.state;
    // const m_width = this.props.w * this.state.s;
    // const m_height = this.props.h * this.state.s;
    //   const _frameColor = [
    //     parseInt(frameColor.slice(1,3), 16),
    //     parseInt(frameColor.slice(3,5), 16),
    //     parseInt(frameColor.slice(5,7), 16)
    //   ];
    const minimapStyle = {
      width,
      height: width * r,
    };
    const frameStyle = {
      left: width * l,
      top: width * r * t,
      width: width * w,
      height: width * r * h,
      //background: `rgba($, 0.1)`.replace('$', _frameColor),
      //borderColor: frameColor,
    };
      // <div className='minimap__handle handle' />
    return <div className='minimap' style={minimapStyle}>
      <img ref='img' className='minimap__hidden' src={desc.bg} onLoad={this.updateBg}/>
      <canvas className='minimap__bg' ref='bg' onClick={this.sendPosition} />
      { showObj ? <canvas className='minimap__layer'  ref='layer' /> : null}
      <div className='minimap__frame' style={frameStyle} />
    </div>
  }
  sendPosition(e) {
    let {clientX, clientY} = e;
    let {dispatch, width} = this.props;
    let {s, r} = this.state;
    let {left, top} = findDOMNode(this).getBoundingClientRect();
    let x = (clientX - left) / (width);
    let y = (clientY - top) / (width * r);
    dispatch(updateLayerCentre({x, y,}));
  }

  updateBg() {
    const {img, bg} = this.refs;
    const {width} = this.props;

    const scale = width/img.width;
    this.setState({
      s: scale,
      r: img.height/img.width,
    });
    bg.width = img.width * scale;
    bg.height = img.height * scale;
    let bgctx = bg.getContext('2d');
    bgctx.fillStyle = 'white';
    bgctx.fillRect(0, 0, img.width, img.height);
    bgctx.save();
    bgctx.scale(scale, scale);
    bgctx.drawImage(img, 0, 0);
    bgctx.restore();
    this.renderLayer();
  }
  renderLayer() {
    if (this.props.showObj) {
      let lcanvas = this.refs.layer;
      let {states, width, point} = this.props;
      let offscreen = document.createElement('canvas');
      let {r, s} = this.state
      offscreen.width = width;
      offscreen.height = width * r;
      lcanvas.width = width;
      lcanvas.height = width * r;
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
  }
};

const selector = createSelector(
  (state) => state.framePosition,
  (state) => state.objects.states,
  (framePosition, states) => ({
      framePosition,
      states,
    })
);

export default connect(selector)(Minimap);

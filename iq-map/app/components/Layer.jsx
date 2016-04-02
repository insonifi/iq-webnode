'use strict'
import React, {Component, cloneElement} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import _ from 'lodash';
import Obj from './Object';
import {getObjectState} from '../stores/MapStore';
import {updateLayer, updateFrame, fitLayer} from '../actions/MapActionCreators';
import {boundedPosition} from '../utils/misc';

/**
 * Load object components
 * */
// require('../components/Camera');
// require('../components/Sensor');
class Layer extends Component {
  constructor (props) {
    super(props);
    this.startDrag = this.startDrag.bind(this);
    this.stopDrag = this.stopDrag.bind(this);
    this.drag = this.drag.bind(this);
    this.zoom = this.zoom.bind(this);
    this.getSize = this.getSize.bind(this);
    this.notifyMinimap = _.throttle(this.notifyMinimap.bind(this), props.notifyLimit);
    this.dragPos = {
      x: 0,
      y: 0,
    }
    // let {x, y, w, h, s} = this.props;
    // this.state = {x, y, w, h, s};

  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.desc.bg !== this.props.desc.bg) {
      this.getSize(nextProps.desc.bg);
    }
    if (this.props.x !== nextProps.x ||
        this.props.y !== nextProps.y ||
        this.props.w !== nextProps.w ||
        this.props.h !== nextProps.h ||
        this.props.s !== nextProps.s) {

      this.notifyMinimap();
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return Math.trunc(this.props.x + this.props.y) !== Math.trunc(nextProps.x + nextProps.y)
     || this.props.desc !== nextProps.desc;
  }
  componentDidUpdate() {
  }
  render() {
    const {desc, filter} = this.props;
    const _config = _(desc.config);
    const {x, y, w, h, s, collapseDist} = this.props;
//    let {scrollX, scrollY} = window;
    const layerStyle = {
      left: Math.round(x),
      top: Math.round(y),
      width: w * s,
      height: h * s,
    };
    // let bg = {
    //   left: '50%',
    //   top: '50%',
    //   position: 'absolute',
    //   transform: `translate(-50%, -50%) scale(${s})`,
    // };

    const LayerBase = (<div className='layer'>
      {
        _config
          .map((o) => _.assign({}, o, {
            x: o.x * s,
            y: o.y * s,
          }))
          .filter((o) => {
            let posX = o.x + x;
            let posY = o.y + y;
            return filter[o.type] &&
              (0 < posX && posX < window.innerWidth) &&
              (0 < posY && posY < window.innerHeight)
          })
          .map((o, idx, array) => {
            let i = array.length;
            let item, dx, dy, dist;
            for (;--i;) {
              if (i === idx) {
                continue;
              }
              item = array[i];
              dx = item.x - o.x;
              dy = item.y - o.y;
              dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
              if (collapseDist > dist) {
                o.collapse = true;
                break;
              }
            }
            return o;
          })
          .map((o) => <Obj id={o.id} key={o.type + o.id} name={o.name}
            x={o.x} y={o.y} state={getObjectState(o.type, o.id)}
            type={o.type} collapse={o.collapse} />)
          .value()
      }
      {cloneElement(<img src={desc.bg} className='layer__bg' />)}
    </div>);

    return cloneElement(LayerBase, {
      style: layerStyle,
      onMouseDown: this.startDrag,
      onMouseUp: this.stopDrag,
      onWheel: this.zoom,
    });

  }
  startDrag(e) {
    e.preventDefault();
    window.addEventListener('mousemove', this.drag, true);
    this.dragPos ={
      x0: e.clientX,
      y0: e.clientY,
    };
  }

  stopDrag(e) {
    window.removeEventListener('mousemove', this.drag, true);
  }

  drag(e) {
    //stop drag if mouse button was released
    e.preventDefault();
    if (e.which === 0) {
      this.stopDrag(e);
      return false;
    }
    let {x, y, w, h, s} = this.props;
    let {dispatch} = this.props;
    let {clientX, clientY} = e;
    let {x0, y0} = this.dragPos;
    let dx = x + clientX - x0;
    let dy = y + clientY - y0;
    // Check bounds
    this.dragPos = {
      x0: clientX,
      y0: clientY,
    };
    // window.scrollBy(-dx, -dy);
    dispatch(updateLayer({
      x: dx,
      y: dy,
      w,
      h,
      s
    }));
  }
  zoom(e) {
    e.preventDefault();
    let sign = -Math.sign(e.deltaY);
    let {x, y, w, h, s} = this.props;
    let {maxZoom, minZ, dispatch} = this.props;
    let oscale = s;
    let scale = s * (1 + 0.05 * sign);
    if (scale > maxZoom || scale < minZ) {
      return;
    }
    let dscale = oscale - scale;
    let {width, height} = e.currentTarget.getBoundingClientRect();
    let {clientX, clientY} = e;
//     let {scrollX, scrollY} = window;
//     let ox = (clientX - x + scrollX) / width;
//     let oy = (clientY - y + scrollY) / height;
    let ox = (clientX - x) / width;
    let oy = (clientY - y) / height;
    let dx = dscale * w * ox;
    let dy = dscale * h * oy;

    let offsetX = x + dx;
    let offsetY = y + dy;

    let leftEdge = offsetX;
    let rightEdge = -(offsetX + (w * scale) - window.innerWidth);
    let topEdge = offsetY;
    let bottomEdge = -(offsetY + (h * scale) - window.innerHeight);
    if (sign < 0) {
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

    // window.scrollBy(-dx, -dy);
    dispatch(updateLayer({
      x: x + dx,
      y: y + dy,
      w,
      h,
      s: scale,
    }));
  }
  getSize(src) {
    let image = document.createElement('img');
    let {x, y, s, dispatch} = this.props;
    let layerDOM = ReactDOM.findDOMNode(this);

    layerDOM.appendChild(image);
    image.style.visibility = 'hidden';
    image.addEventListener('load', () => {
      dispatch(updateLayer({
        x,
        y,
        w: image.width,
        h: image.height,
        s,
      }));
      dispatch(fitLayer());
      layerDOM.removeChild(image);
    });
    image.src = src;
  }
  // updatePosition: function () {
  //   let {w, h, s} = this.props;
  //   let pos = MapStore.getLayerPosition();
  //   var scaledWidth = s * w;
  //   var scaledHeight = s * h;
  //   var _x = innerWidth * 0.5 - scaledWidth * pos.x;
  //   var _y = innerHeight * 0.5 - scaledHeight * pos.y;
  //   // Check bounds
  //   var {x, y} = this.boundedPosition(_x, _y);
  //   updateLayer({x, y, w, h, s,});
  // },
  notifyMinimap () {
    let {dispatch} = this.props;
    let {left, right, top, bottom, width, height} = ReactDOM.findDOMNode(this)
                                                        .getBoundingClientRect();
    let l = Math.max(-left, 0)/width;
    let t = Math.max(-top, 0)/height;
    let w = window.innerWidth/width;
    let h = window.innerHeight/height;
    dispatch(updateFrame({l, t, w, h}));
  }
};

Layer.defaultProps = {
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  s: 1,
  desc: {bg: '', config: []},
}
let selector = createSelector(
  (state) => state.filter,
  (state) => state.layerGeometry,
  (filter, {w, h, x, y, s, minZ}) => ({
    filter,
    x, y, w, h, s, minZ,
  })
);

export default connect(selector)(Layer);

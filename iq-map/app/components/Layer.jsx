'use strict'
import React, {Component, cloneElement} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import _ from 'lodash';
import {getObjectState} from '../stores/MapStore';
import {updateLayer, updateFrame, fitLayer} from '../actions/MapActionCreators';

/**
 * Load object components
 * */
require('../components/Camera');
require('../components/Sensor');

const REFRESH_LIMIT = 100;

class Layer extends Component {
  constructor (props) {
    super(props);
    this.startDrag = this.startDrag.bind(this);
    this.stopDrag = this.stopDrag.bind(this);
    this.drag = this.drag.bind(this);
    this.zoom = this.zoom.bind(this);
    this.getSize = this.getSize.bind(this);
    this.boundedPosition = this.boundedPosition.bind(this);
    this.notifyMinimap = _.throttle(this.notifyMinimap.bind(this), REFRESH_LIMIT);
    this.dragPos = {
      x: 0,
      y: 0,
    }
    // let {x, y, w, h, s} = this.props;
    // this.state = {x, y, w, h, s};

  }
  componentDidMount() {
    this.getSize();
  }
  componentWillUnmount() {
  }
  componentWillReceiveProps(nextProps) {
    // let {x, y, w, h, s} = nextProps;
    // this.setState({x, y, w, h, s});
  }
  componentDidUpdate() {
    this.notifyMinimap();
  }
  render() {
    let desc = this.props.desc || {bg: '', config: []};
    let _config = _(desc.config);
    let {factories, filter, states, dispatch} = this.props;
    let {x, y, w, h, s} = this.props;
    let {scrollX, scrollY} = window;
    let layerStyle = {
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

    let LayerBase = (<div className='layer'>
      {
        _config.map(function (obj) {
          let {type, id} = obj;
          let o_x = obj.x * s;
          let o_y = obj.y * s;
          let pos_x = o_x + x;
          let pos_y = o_y + y;
          if (filter[type] && (0 < pos_x && pos_x < window.innerWidth) &&
              (0 < pos_y && pos_y < window.innerHeight)) {
            return factories[obj.type]({
              id,
              key: type + id,
              x: o_x,
              y: o_y,
              state: getObjectState(type, id),
            });
          } else {
            return null;
          }
        }).value()
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
    let {x, y} = this.props;
    let {dispatch} = this.props;
    let {clientX, clientY} = e;
    let {x0, y0} = this.dragPos;
    let dx = x + clientX - x0;
    let dy = y + clientY - y0;
    // Check bounds
    let {bx, by} = this.boundedPosition(dx, dy);
    this.dragPos = {
      x0: clientX,
      y0: clientY,
    };
    // this.setState({
    //   x: bx,
    //   y: by,
    // });
    // window.scrollBy(-dx, -dy);
    // this.notifyMinimap();
    dispatch(updateLayer({x: bx, y: by}));
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
    let {scrollX, scrollY} = window;
    let ox = (clientX - x + scrollX) / width;
    let oy = (clientY - y + scrollY) / height;
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
    // this.setState({
    //   x: x + dx,
    //   y: y + dy,
    //   s: scale,
    // });

    // window.scrollBy(-dx, -dy);
    dispatch(updateLayer({
      x: x + dx,
      y: y + dy,
      s: scale,
    }));
  }
  getSize() {
    let image = document.createElement('img');
    let {dispatch} = this.props;
    image.addEventListener('load', () => {
      dispatch(updateLayer({
        w: image.width,
        h: image.height,
      }));
      dispatch(fitLayer());
    });
    image.src = this.props.desc.bg;
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
    let r = Math.max(right - window.innerWidth, 0)/width;
    let b = Math.max(bottom - window.innerHeight, 0)/height;
    dispatch(updateFrame({l, t, r, b}));
  }
  boundedPosition(x, y) {
    let bx = x;
    let by = y;
    var {w, h, s} = this.props;
    var scaledWidth = w * s;
    var scaledHeight = h * s;
    bx = Math.min(bx, 0);
    by = Math.min(by, 0);
    bx = Math.max(bx, window.innerWidth - scaledWidth);
    by = Math.max(by, window.innerHeight - scaledHeight);
    return {bx, by};
  }
};

let selector = createSelector(
  (state) => state.factories,
  (state) => state.filter,
  (state) => state.objects.states,
  (state) => state.objects.behaviours,
  (state) => state.layerGeometry,
  (factories, filter, states, behaviours, {w, h, x, y, s, minZ}) => ({
    factories,
    filter,
    states,
    behaviours,
    x, y, w, h, s, minZ,
  })
);

export default connect(selector)(Layer);

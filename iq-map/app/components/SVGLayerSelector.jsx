'use strict'
import React, {Component} from 'react';
import d3 from 'd3';
import _ from 'lodash';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';
import MapStore from '../stores/MapStore';
import {toggleSelector, selectLayer} from '../actions/MapActionCreators';


const ALARMED = '#ff2323';
const HOVER = '#11aaff';
const ACTIVE = 0.6;
const INACTIVE = 0.2;


class SVGLayerSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {svg: ''};
    this.load = this.load.bind(this);
    this.init = this.init.bind(this);
    this.mouseIn = this.mouseIn.bind(this);
    this.mouseOut = this.mouseOut.bind(this);
    this.onClick = this.onClick.bind(this);
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  componentWillMount() {
    this.load();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selected !== this.props.selected) {
      {
        let oSelected = prevProps.selected;
        this.state.selectors[oSelected]
          .transition().attr({
            'fill-opacity': INACTIVE
          })
      }
      {
        let nSelected = this.props.selected;
        this.state.selectors[nSelected]
          .transition().attr({
            'fill-opacity': ACTIVE
          })
      }
    }
    if (prevProps.alarmedLayers !== this.props.alarmedLayers) {
      let {alarmedLayers} = this.props;
      _(this.state.selectors).forEach((function (n, key) {
        this.state.selectors[key]
          .transition().attr({
            fill: alarmedLayers[key] ? ALARMED : INACTIVE,
          })
      }).bind(this)).value();
    }
  }
  render() {
    let {svg} = this.state;
    let {layerNames, dispatch, selected, open, alarmedLayers} = this.props;
    let style = {
      // transform: open ? 'translate(0,-50%)' : 'translate(100%,-50%)',
    };
    let titleStyle = {
      transform: 'translate(-67%,-50%) rotateZ(-90deg)',
      position: 'absolute',
      top: '50%',
    };
    let getSVG = () => ({
        __html: svg
      });
      // <RaisedButton style={titleStyle} label='Overview' onClick={() => dispatch(toggleSelector())}/>
    return <div className='overview' style={style}>
      <Paper zDepth={1}>
        <span ref='container' dangerouslySetInnerHTML={getSVG()} className="overview__image"/>
      </Paper>
    </div>
  }
  init() {
    let svg = this.refs.container.querySelector('svg');
    let {layerNames, selected} = this.props;
    let {mouseIn, mouseOut, onClick} = this;
    let selectors = _(svg.querySelectorAll('[layer]')).reduce((accum, s) => {
      accum[s.getAttribute('layer')] = d3.select(s);
      return accum;
    }, {});
    _(layerNames).forEach((n, key) => {
      let selector = selectors[key];
      selector
        .attr({
          'fill-opacity': INACTIVE,
          style: 'pointer-events: all',
          stroke: HOVER,
          'stroke-width': 2,
          'stroke-opacity': 0
        })
        .on('mouseover', mouseIn.bind(null, key))
        .on('mouseout', mouseOut.bind(null, key))
        .on('click', onClick.bind(null, key))
        .selectAll('*')
          .attr({style: ''});
    }).value();
    this.setState({
      selectors
    });
    selectors[selected]
      .attr({
        'fill-opacity': ACTIVE
      });
  }

  mouseIn(key) {
    let selector = this.state.selectors[key];
    selector
      .transition().attr({
        'stroke-opacity': 1
      })
  }

  mouseOut(key) {
    let selector = this.state.selectors[key];
    selector
      .transition().attr({
        'stroke-opacity': 0
      })
  }
  load() {
    let {src} = this.props;
    let xhr = new XMLHttpRequest();
    let _this = this;
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        _this.setState({
          svg: xhr.responseText
        })
        _this.init();
      }
    });
    xhr.open('GET', src);
    xhr.send();
  }
  onClick(key) {
    this.props.dispatch(selectLayer(key));
  }
};

let select = createSelector(
  (state) => state.layerSelected,
  (state) => state.selectorOpen,
  (state) => state.objects.alarmed,
  (selected, open, alarmedLayers) => ({
    selected,
    open,
    alarmedLayers,
  })
);

export default connect(select)(SVGLayerSelector);

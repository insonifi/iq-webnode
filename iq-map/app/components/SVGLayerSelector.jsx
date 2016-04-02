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
        this.state.selectors.get(oSelected)
          .classed('layer__item--selected', false);
      }
      {
        let nSelected = this.props.selected;
        this.state.selectors.get(nSelected)
          .classed('layer__item--selected', true);
      }
    }
    if (prevProps.alarmedLayers !== this.props.alarmedLayers) {
      let {alarmedLayers} = this.props;
      this.state.selectors.forEach((selector, key) =>
        selector.classed('layer__item--alarmed', alarmedLayers.has(key)));
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
      <div zDepth={1}>
        <span ref='container' dangerouslySetInnerHTML={getSVG()} className="overview__image"/>
      </div>
      <div>{JSON.stringify(alarmedLayers)}</div>
    </div>
  }
  init() {
    let svg = this.refs.container.querySelector('svg');
    let {layerNames, selected} = this.props;
    let {mouseIn, mouseOut, onClick} = this;
    let selectors =  new Map();
    d3.select(svg).selectAll('[layer]')
      .attr('style', null)
      .classed('layer__item', true)
      .each(function () {
        const d3selected = d3.select(this);
        const layerKey = parseInt(d3selected.attr('layer'));
        selectors.set(layerKey, d3selected);
      })
      .selectAll('*').attr('style', null)
    _(layerNames).forEach((n, key) => 
      selectors.get(key)
        // .on('mouseover', mouseIn.bind(null, key))
        // .on('mouseout', mouseOut.bind(null, key))
        .on('click', onClick.bind(null, key)));
    this.setState({
      selectors
    });
    selectors.get(selected)
      .classed('layer__item--selected', true);
  }

  mouseIn(key) {
    this.state.selectors(key)
      .transition().attr({
        'stroke-opacity': 1
      })
  }

  mouseOut(key) {
    this.state.selectors(key)
      .transition().attr({
        'stroke-opacity': 0
      })
  }
  load() {
    let {src} = this.props;
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        this.setState({
          svg: xhr.responseText
        })
        this.init();
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

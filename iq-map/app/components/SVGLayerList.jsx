'use strict'
var React = require('react'); 
var ISVG = require('react-inlinesvg');
var d3 = require('d3');
var {Paper}= require('material-ui');
var _ = require('lodash');

var ALARMED = '#ff2323';
var HOVER = '#11aaff';
var INACTIVE = '#000000';

var MapStore = require('../stores/MapStore');

var SVGLayerList = React.createClass({
  getInitialState: function () {
    return {
/*      svg: Snap()*/
    }
  },
  displayName: 'SVGLayerList',
  componentDidMount: function () { 
    MapStore.addStateUpdateListener(this._onState);
  },
  componentWillUnmounte: function () {
    MapStore.removeStateUpdateListener(this._onState);
  },
  componentWillReceiveProps: function (props) {
  },
  componentDidUpdate: function (prevProps, prevState) {
    var prefix = this.props.prefix;
    var selected = this.props.selectedIndex;
/*
    this.state.svg
      .selectAll('.' + prefix)
      .forEach(this._refreshStyle);
*/
    
  },
  render: function () {
    return <Paper zDepth={3} className='overview'> 
      <ISVG src={this.props.src} onLoad={this._loadCallback} style='padding: 30px' />
    </Paper>
  },
  _loadCallback: function () {
    var svg = this.getDOMNode().querySelector('svg');
    var names = this.props.layerNames;
    var _mouseIn = this._mouseIn;
    var _mouseOut = this._mouseOut;
    var _onClick = this._onClick;
    var selectors = _(document.querySelectorAll('[layer]')).reduce((accum, s) => {
      accum[s.getAttribute('layer')] = d3.select(s);
      return accum;
    }, {});
    _(names).forEach(function (n, key) {
      let selector = selectors[key];
      selector
        .attr({
          'fill-opacity': 0.2,
          style: 'pointer-events: all',
          stroke: HOVER,
          'stroke-width': 2,
          'stroke-opacity': 0
        })
        .on('mouseover', _mouseIn.bind(null, key))
        .on('mouseout', _mouseOut.bind(null, key))
        .on('click', _onClick.bind(null, key))
        .selectAll('*')
          .attr({style: ''});
    }).value();
    this.setState({
      selectors
    });
  },
    
  _mouseIn: function (key) {
    let selector = this.state.selectors[key];
    selector
      .transition().attr({
        'stroke-opacity': 1
      })
  },
    
  _mouseOut: function (key) {
    let selector = this.state.selectors[key];
    selector
      .transition().attr({
        'stroke-opacity': 0
      })
  },
    
  _onClick: function (key) {
    {
      let selected = this.props.selectedIndex;
      this.state.selectors[selected]
        .transition().attr({
          'fill-opacity': 0.2
        })
    }
    {
      let selected = this.props.selectedIndex;
      this.state.selectors[key]
        .transition().attr({
          'fill-opacity': 0.6
        })
    }
    this.props.onChange(null, key, null);
  },
    
  _refreshStyle: function (el) {
    var pref_length = this.props.prefix.length;
    var selected = this.props.selectedIndex;
    var isSelected = selected === key;
    var isAlarmed = this.props.alarmedList[key];
    var isVisible = isSelected || isAlarmed;
    d3(el)
      .attr({
      })
      .transition.attr({
        fill: isAlarmed ? ALARMED : INACTIVE,
        'fill-opacity': isSelected ? 0.6 : 0.2
      }, 100);
  },
  
  _onState: function () {
/*
    this.setState({
      layerAlarmed: MapStore.getAlarmed()
    });
*/
    var layersAlarmed =  MapStore.getAlarmed();
    _(this.state.selectors).forEach((function (n, key) {
      this.state.selectors[key]
        .transition().attr({
          fill: layersAlarmed[key] ? ALARMED : INACTIVE,
        })
    }).bind(this)).value();
  }

});

module.exports = SVGLayerList;

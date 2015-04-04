'use strict'
var React = require('react'); 
var ISVG = require('react-inlinesvg');
var d3 = require('d3');
var {Paper, RaisedButton}= require('material-ui');
var _ = require('lodash');

var ALARMED = '#ff2323';
var HOVER = '#11aaff';
var ACTIVE = 0.6;
var INACTIVE = 0.2;

var MapStore = require('../stores/MapStore');

var SVGLayerList = React.createClass({
  getInitialState: function () {
    return {
      closed: true,
      selectors: []
    }
  },
  displayName: 'SVGLayerList',
  componentDidMount: function () { 
    MapStore.addStateUpdateListener(this._onState);
  },
  componentWillUnmount: function () {
    MapStore.removeStateUpdateListener(this._onState);
  },
  componentWillReceiveProps: function (props) {
  },
  render: function () {
    var style = {
      transform: this.state.closed ? 'translate(100%,-50%)' : 'translate(0,-50%)'
    }
    return <div className='overview' style={style}>
      <RaisedButton zDepth={3} className='overview-title' label='Overview' onClick={this.toggle}/>
      <Paper zDepth={3}> 
        <ISVG src={this.props.src} onLoad={this._loadCallback} style='padding: 30px' />
      </Paper>
    </div>
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
          'fill-opacity': INACTIVE,
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
    selectors[this.props.selectedIndex]
      .attr({
        'fill-opacity': ACTIVE
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
          'fill-opacity': INACTIVE
        })
    }
    {
      let selected = this.props.selectedIndex;
      this.state.selectors[key]
        .transition().attr({
          'fill-opacity': ACTIVE
        })
    }
    this.props.onChange(null, key, null);
  },
  
  toggle: function () {
    this.setState({
      closed: !this.state.closed
    });
  },
  
  _onState: function () {
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

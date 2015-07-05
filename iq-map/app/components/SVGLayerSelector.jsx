'use strict'
var React = require('react'); 
//var ISVG = require('react-inlinesvg');
var d3 = require('d3');
var {Paper, RaisedButton}= require('material-ui');
var _ = require('lodash');

var ALARMED = '#ff2323';
var HOVER = '#11aaff';
var ACTIVE = 0.6;
var INACTIVE = 0.2;

var MapStore = require('../stores/MapStore');
var MapActions = require('../actions/MapActionCreators');

var SVGLayerSelector = React.createClass({
  getInitialState: function () {
    return {
      closed: true,
      selected: 0,
      selectors: []
    }
  },
  displayName: 'SVGLayerSelector',
  componentDidMount: function () { 
    MapStore.addChangeListener(this._onChange);
    MapStore.addStateUpdateListener(this._onState);
    
  },
  componentWillUnmount: function () {
    MapStore.removeChangeListener(this._onChange);
    MapStore.removeStateUpdateListener(this._onState);
  },
  componentWillMount: function () {
    this._load();
  },
  render: function () {
    var layerNames = this.props.layerNames;
    var style = {
      transform: this.state.closed ? 'translate(100%,-50%)' : 'translate(0,-50%)'
    };
    var titleStyle = {
      transform: 'translate(-67%,-50%) rotateZ(-90deg)',
      position: 'absolute',
      top: '50%',
    };
    var getSVG = (function () {
      return {
        __html: this.state.svg
      }
    }).bind(this);
    return <div className='overview' style={style}>
      <RaisedButton style={titleStyle} label='Overview' onClick={this.toggle}/>
      <Paper zDepth={3}> 
        <span dangerouslySetInnerHTML={getSVG()} style={{padding: 30}} />
      </Paper>
    </div>
  },
  _init: function () {
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
      var selector = selectors[key];
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
    selectors[this.state.selected]
      .attr({
        'fill-opacity': ACTIVE
      });
  },
    
  _mouseIn: function (key) {
    var selector = this.state.selectors[key];
    selector
      .transition().attr({
        'stroke-opacity': 1
      })
  },
    
  _mouseOut: function (key) {
    var selector = this.state.selectors[key];
    selector
      .transition().attr({
        'stroke-opacity': 0
      })
  },
  _load: function () {
    var xhr = new XMLHttpRequest();
    var _this = this;
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        _this.setState({
          svg: xhr.responseText
        })
        _this._init();
      }
    });
    xhr.open('GET', this.props.src);
    xhr.send();
  },
  _onClick: function (key) {
    MapActions.select(key);
  },
  
  _onChange: function () {
    {
      var oSelected = this.state.selected;
      this.state.selectors[oSelected]
        .transition().attr({
          'fill-opacity': INACTIVE
        })
    }
    this.setState({
      selected: MapStore.getSelected()
    });
    {
      var nSelected = this.state.selected;
      this.state.selectors[nSelected]
        .transition().attr({
          'fill-opacity': ACTIVE
        })
    }
  },
  
  toggle: function () {
    this.setState({
      closed: !this.state.closed
    });
  },
  open: function () {
    this.setState({
      closed: false
    });
  },
  close: function () {
    this.setState({
      closed: true
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

module.exports = SVGLayerSelector;

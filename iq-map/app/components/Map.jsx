'use strict'
var React = require('react');
var { LeftNav, RaisedButton, Paper, FloatingActionButton } = require('material-ui');

var SVGLayerSelector = require('../components/SVGLayerSelector');
var Layer = require('../components/Layer');
var Viewport = require('../components/Viewport');

var _ = require('lodash');
var MapStore = require('../stores/MapStore');
var MapActions = require('../actions/MapActionCreators');
var Map = React.createClass({
  getInitialState: function () {
    return {
      selected: 0,
      layerNames: [],
      layers: [],
    };
  },
  displayName: 'Map',
  componentDidMount: function () {
    MapStore.addChangeListener(this._onChange);
    MapStore.addStateUpdateListener(this._onState);
    MapStore.addConfigListener(this._onConfig);
  },
  componentWillUnmounte: function () {
    MapStore.removeChangeListener(this._onChange);
    MapStore.removeStateUpdateListener(this._onState);
    MapStore.removeConfigListener(this._onState);
  },
  render: function () {
    var layerNames = this.state.layerNames;
    var hasLayers = (layerNames.length > 0);
    var selected = this.state.selected;
    var layer = this.state.layers[selected];
        
    return (
      <div>
        {hasLayers ? <RaisedButton onClick={this._toggle} label={layerNames[selected]} className='layer-title' /> : null}
        
        <FloatingActionButton
          className='overview-fit'
          circle={true}
          mini={true}
          onClick={this._fit} ><img className='overview-icon' src='/img/fit.svg' /></FloatingActionButton>
        
        <Viewport>
          <Layer ref='Layer' desc={layer} maxZoom={5} />
        </Viewport>
        {hasLayers ?
          <SVGLayerSelector
            ref='LayerList'
            src='/img/overview.svg'
            layerNames={layerNames}
            selectedIndex={selected} />
          : null}
      </div>
    )
  },
  _onChange: function () {
    this.setState({
      selected: MapStore.getSelected()
    });
  },
  
  _onConfig: function () {
    var _config = _(MapStore.getMapConfig());
    this.setState({
      layerNames: _config.pluck('name').value(),
      layers: _config.value(),
    });
  },
  
  _onState: function () {
    this.setState({
      layerAlarmed: MapStore.getAlarmed()
    });
  },
  
  _changeLayer: function (e, key, payload) {
    this.setState({selected: key});
  },
  _toggle: function () {
    this.refs.LayerList.toggle();
  },
  
  _fit: function () {
    this.refs.Layer.fit();
  }
});

module.exports = Map;
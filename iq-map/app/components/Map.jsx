'use strict'
var React = require('react');
var { LeftNav, RaisedButton, Paper } = require('material-ui');

var SVGLayerList = require('../components/SVGLayerList');
var Layer = require('../components/Layer');
var Viewport = require('../components/Viewport');

var _ = require('lodash');
var MapStore = require('../stores/MapStore');
var MapActions = require('../actions/MapActionCreators');
var Map = React.createClass({
  getInitialState: function () {
    return {
      active: 0,
      layerNames: [],
      layers: []
    };
  },
  displayName: 'Map',
  componentDidMount: function () {
    MapStore.addChangeListener(this._onChange);
    MapStore.addStateUpdateListener(this._onState);
    MapStore.addConfigListener(this._onConfig);
    MapStore.requestMapConfig();
    this.refs.LayerList.close();
  },
  componentWillUnmounte: function () {
    MapStore.removeChangeListener(this._onChange);
    MapStore.removeStateUpdateListener(this._onState);
  },
  render: function () {
    var layerNames = this.state.layerNames;
    var active = this.state.active;
    var layer = this.state.layers[active];
    var items = _(layerNames).map(function (item) {
      return {text: item};
    }).value();
    
    return (
      <div>
        <RaisedButton onClick={this._toggle} label={layerNames[active]} className='layer-title' />
      
        <LeftNav ref='LayerList' menuItems={items}
          onChange={this._changeLayer} 
          header={<Paper>Layers</Paper>} />
        <Viewport>
          <Layer desc={layer} minZoom={0.2} maxZoom={5} />
        </Viewport>
        <SVGLayerList src='img/overview.svg' 
          layerNames={layerNames} onChange={this._changeLayer}
          selectedIndex={active}/>
      </div>
    )
  },
  _onChange: function () {
  },
  
  _onConfig: function () {
    var _config = _(MapStore.getMapConfig());
    this.setState({
      layerNames: _config.pluck('name').value(),
      layers: _config.value()
    });
  },
  
  _onState: function () {
    this.setState({
      layerAlarmed: MapStore.getAlarmed()
    });
  },
  
  _changeLayer: function (e, key, payload) {
    this.setState({active: key});
    this.refs.LayerList.close();
  },
  _toggle: function () {
    this.refs.LayerList.toggle();
  }  
});

module.exports = Map;


/*
        <ul>
          {
            _(layerNames).map(function (name) {
              return <li key={name}>{name}</li>
            }).value()
          }
        </ul>
*/
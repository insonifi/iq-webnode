'use strict'
var React = require('react');
var { LeftNav, RaisedButton, Paper, FloatingActionButton, SvgIcon } = require('material-ui');

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
          onClick={this._fit} >
          <SvgIcon>
            <path
     style='fill:#ffffff"
     d="M 16.322266 0 C 7.2803027 0 0 7.2803256 0 16.322266 L 3.0136719 16.322266 C 3.0136719 13.149361 4.0941185 10.263443 5.9042969 7.9921875 L 15.222656 17.310547 A 11.050313 11.050313 0 0 1 17.306641 15.21875 L 7.9921875 5.9042969 C 10.263454 4.0941119 13.149393 3.0136719 16.322266 3.0136719 L 16.322266 0 z M 31.679688 0 L 31.679688 3.0136719 C 34.852193 3.0136719 37.737003 4.0945619 40.007812 5.9042969 L 30.689453 15.222656 A 11.050313 11.050313 0 0 1 32.78125 17.306641 L 42.095703 7.9921875 C 43.90556 10.263443 44.986328 13.149286 44.986328 16.322266 L 48 16.322266 C 48 7.2803256 40.721659 0 31.679688 0 z M 32.777344 30.689453 A 11.050313 11.050313 0 0 1 30.693359 32.78125 L 40.007812 42.095703 C 37.737049 43.905048 34.852261 44.986328 31.679688 44.986328 L 31.679688 48 C 40.721659 48 48 40.721612 48 31.679688 L 44.986328 31.679688 C 44.986328 34.852263 43.905048 37.737112 42.095703 40.007812 L 32.777344 30.689453 z M 15.21875 30.693359 L 5.9042969 40.007812 C 4.0945508 37.737023 3.0136719 34.852188 3.0136719 31.679688 L 0 31.679688 C 0 40.721612 7.2803027 48 16.322266 48 L 16.322266 44.986328 C 13.149243 44.986328 10.26343 43.905513 7.9921875 42.095703 L 17.310547 32.777344 A 11.050313 11.050313 0 0 1 15.21875 30.693359 z' />
          </SvgIcon>
        </FloatingActionButton>
        
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
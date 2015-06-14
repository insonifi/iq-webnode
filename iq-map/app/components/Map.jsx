'use strict'
var React = require('react');
var mui = require('material-ui');
var { RaisedButton, Paper} = mui;
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;

var SVGLayerSelector = require('../components/SVGLayerSelector');
var Layer = require('../components/Layer');
var Viewport = require('../components/Viewport');
var Minimap = require('../components/Minimap');
var FitButton = require('../components/FitButton');

var _ = require('lodash');
var MapStore = require('../stores/MapStore');
var MapActions = require('../actions/MapActionCreators');
var Map = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext: function () {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  },
  getInitialState: function () {
    return {
      selected: 0,
      layerNames: [],
      layers: [],
    };
  },
  displayName: 'Map',
  componentWillMount: function () {
    ThemeManager.setPalette({
      accent1Color: Colors.deepOrange500
    });
  },
  componentDidMount: function () {
    MapStore.addChangeListener(this._onChange);
    MapStore.addStateUpdateListener(this._onState);
    MapStore.addConfigListener(this._onConfig);
  },
  componentWillUnmount: function () {
    MapStore.removeChangeListener(this._onChange);
    MapStore.removeStateUpdateListener(this._onState);
    MapStore.removeConfigListener(this._onState);
  },
  render: function () {
    var layerNames = this.state.layerNames;
    var hasLayers = (layerNames.length > 0);
    var selected = this.state.selected;
    var layer = this.state.layers[selected];
    var labelStyle = {
      position: 'fixed',
      zIndex: 2,
      left: '50%',
    };
    var fitButtonStyle = {
      position: 'fixed',
      zIndex: 2,
      right: '1%',
   };
    // style={labelStyle}
    // style={fitButtonStyle}
    if (hasLayers) {
      return (
        <div>
          <RaisedButton onClick={this._toggle} label={layerNames[selected]} style={labelStyle} />
          <FitButton onClick={this._fit} style={fitButtonStyle} />
          <Minimap desc={layer} />
          <Viewport>
            <Layer ref='Layer' desc={layer} maxZoom={5} />
          </Viewport>
          <SVGLayerSelector
            ref='LayerList'
            src='/img/overview.svg'
            layerNames={layerNames}
            selectedIndex={selected} />
        </div>
      )
    } else {
      return null
    }
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

'use strict'
import _ from 'lodash';
import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import Colors from 'material-ui/lib/styles/colors';
import Theme from '../utils/Theme';

import SVGLayerSelector from './SVGLayerSelector';
import Layer from './Layer';
import Legend from './Legend'
import Viewport from './Viewport';
import Minimap from './Minimap';
import FitButton from './FitButton';

import MapStore from '../stores/MapStore';
import {fitLayer, selectLayer} from '../actions/MapActionCreators';
import {requestState} from '../utils/IqNode';

class Map extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  componentWillReceiveProps (nextProps) {
  }
  render() {
    const { dispatch, layerNames, layers, selected } = this.props;
    const layer = _.get(layers, selected, {config: [], bg: '', name:''});
    const types = _(_.get(layer, 'config')).map('type').uniq().value();
    const menuItems = _.map(layerNames, (val, idx) => ({payload: idx, text: val}));

    return <div>
      <div className='layer__fit'>
        <FitButton onClick={() => dispatch(fitLayer())} />
      </div>
      <Viewport>
        <Layer desc={layer} maxZoom={20} notifyLimit={500} collapseDist={40}/>
        <Legend items={types} draggable={true}/>
      </Viewport>
    </div>
  }
}

let selector = createSelector(
  (state) => _.map(state.objects.config, 'name'),
  (state) => state.objects.config,
  (state) => state.layerSelected,
  (layerNames, layers, selected) => ({
    layerNames,
    layers,
    selected,
  })
);



export default connect(selector)(Map);

'use strict'
import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import RaisedButton from 'material-ui/lib/raised-button';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import Colors from 'material-ui/lib/styles/colors';
import Theme from '../utils/Theme';

import SVGLayerSelector from './SVGLayerSelector';
import Layer from './Layer';
import Legend from './Legend'
import Viewport from './Viewport';
import Minimap from './Minimap';
import FitButton from './FitButton';

import _ from 'lodash';
import MapStore from '../stores/MapStore';
import {toggleSelector, fitLayer} from '../actions/MapActionCreators';
import {requestState} from '../utils/IqNode';

class Map extends Component {
  // getChildContext: function () {
  //   return {
  //     muiTheme: ThemeManager.getMuiTheme(Theme)
  //   }
  // },
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
    let { dispatch, layerNames, layers, selected, selectorOpen,
          factories } = this.props;
    let layer = layers[selected];
    let layerName = layerNames[selected];

    return (
      <div>
        { layerName ?
          <div className='layer__title'>
            <RaisedButton onClick={() => dispatch(toggleSelector())}
            label={layerName}/>
          </div>
          : null
        }
        <div className='layer__fit'>
          <FitButton onClick={() => dispatch(fitLayer())} />
        </div>
        { layer ?
          <Minimap desc={layer} frameColor={Colors.deepOrange500} />
          : null
        }
        { layer ?
          <Viewport>
            <Layer desc={layer} maxZoom={20} />
          </Viewport>
          : null
        }
        <Legend />
        { layerNames.length > 0 ?
          <SVGLayerSelector
            src='/img/overview.svg'
            layerNames={layerNames}
            open={selectorOpen}
            selectedIndex={selected} />
          : null
        }
      </div>
    )
  }
}

let selector = createSelector(
  (state) => _.pluck(state.objects.config, 'name'),
  (state) => state.objects.config,
  (state) => state.layerSelected,
  (state) => state.selectorOpen,
  (state) => state.factories,
  (layerNames, layers, selected, selectorOpen, factories) => ({
    layerNames,
    layers,
    selected,
    selectorOpen,
    factories,
  })
);



export default connect(selector)(Map);

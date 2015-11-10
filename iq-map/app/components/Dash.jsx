'use strict'
import React, {PropTypes, Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import RaisedButton from 'material-ui/lib/raised-button';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import Colors from 'material-ui/lib/styles/colors';
import Theme from '../utils/Theme';

import SVGLayerSelector from './SVGLayerSelector';
import Legend from './Legend'
import Minimap from './Minimap';


class Dash extends Component {
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
    let { dispatch, layerNames, layers, selected } = this.props;
    let layer = layers[selected];
    let color = Colors.deepOrange500;

    return (
      <div>
        <div>
          { layerNames.length > 0 ?
            <SVGLayerSelector
              src='/img/overview.svg'
              layerNames={layerNames}
              selectedIndex={selected} />
            : null
          }
          { layer ?
            <Minimap desc={layer} frameColor={color} width={400} point={5}/>
            : null
          }
        </div>
        <Legend />
      </div>
    )
  }
}

let selector = createSelector(
  (state) => _.pluck(state.objects.config, 'name'),
  (state) => state.objects.config,
  (state) => state.layerSelected,
  (layerNames, layers, selected ) => ({
    layerNames,
    layers,
    selected,
  })
);



export default connect(selector)(Dash);

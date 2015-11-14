'use strict'
import React, {Component, cloneElement} from 'react';
import cx from 'classnames';

import IconButton from 'material-ui/lib/icon-button';
import ActionMenu from '../components/ActionMenu';
import {registerFactory, registerBehaviour} from '../actions/MapActionCreators';
import MapStore from '../stores/MapStore';
import {send, requestState} from '../actions/ObjectActionCreators.js';
import machina from 'machina';

const timeout = 1000;
const TYPE = 'GRAY';

const SensorFsm = new machina.BehavioralFsm({
  namespace: TYPE,
  initialState: 'disarmed',
  states: {
    'disarmed': {
      'arm': 'armed',
    },
    'armed': {
      'alarm': 'alarmed',
      'disarm': 'disarmed',
    },
    'alarmed': {
      'confirm': 'armed',
      'disarm': 'disarmed',
    },
  },
  init(client, state) {
    this.handle(client, state);
  },
});

class Sensor extends Component {
  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  render() {
    let {x, y, id, name, state, collapse} = this.props;
    let style = {
      position: 'absolute',
      top: Math.round(y),
      left: Math.round(x),
    };
    let classnames = cx('icon camera', state, {collapse});
    let actions = this.actions(id);
    let component = (
      <div>
        <IconButton iconClassName={classnames} tooltip={name} onClick={this.toggleMenu} />
        <ActionMenu ref='actionMenu' x={x} y={y} actions={actions} />
      </div>
    );
    return cloneElement(component, {
      style,
    });
  }
  actions(id) {
    return [
      {
        label: 'Arm',
        handler() { send({type: TYPE, id, action: 'ARM'}); },
      },
      {
        label: 'Disarm',
        handler() { send({type: TYPE, id, action: 'DISARM'}); },
      },
      {
        label: 'Confirm',
        handler() { send({type: TYPE, id, action: 'CONFIRM'}); }
      },
      {
        label: 'Get state',
        handler() { requestState(TYPE, id); }
      },
    ]
  }

  toggleMenu() {
    this.refs.actionMenu.toggle();
  }
};
Sensor.prototype.displayName = TYPE;
MapStore.dispatch(registerFactory(Sensor));
MapStore.dispatch(registerBehaviour(SensorFsm));
export default Sensor;

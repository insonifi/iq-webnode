'use strict'
import React, {Component, cloneElement} from 'react';
import cx from 'classnames';

import IconButton from 'material-ui/lib/icon-button';
import ActionMenu from '../components/ActionMenu';
import {registerFactory, registerBehaviour} from '../actions/MapActionCreators';
import MapStore from '../stores/MapStore';
import {send, requestState} from '../actions/ObjectActionCreators.js';

const timeout = 1000;

class Obj extends Component {
  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  render() {
    const {x, y, id, name, type, state, collapse} = this.props;
    const actions = [
      {label: 'one'},
      {label: 'two'},
    ];
    let style = {
      position: 'absolute',
      top: Math.round(y),
      left: Math.round(x),
    };
    let classnames = cx('icon', Array.from(state).join(' '), type.toLowerCase(), {collapse});
    let component = (
      <div className={classnames} title={name} onClick={this.toggleMenu}>
        <ActionMenu ref='actionMenu' x={x} y={y} actions={actions} />
      </div>
    );
    return cloneElement(component, {
      style,
    });
  }
  toggleMenu() {
  }
}
export default Obj;

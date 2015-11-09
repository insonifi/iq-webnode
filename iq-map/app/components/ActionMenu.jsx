'use strict'
import React, {Component} from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
import _ from 'lodash';

class ActionMenu extends Component {
  constructor(props) {
    super();
    this.state = {
      isVisible: false,
      delta: 0,
    }
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  render() {
    let {actions} = this.props;
    let {delta, isVisible} = this.state;
    let i = actions.length;
    let radius = (20 + Math.log(i) * 60);
    let angularInterval = 2*Math.PI/i;
    let containerStyle = {
      display: isVisible ? 'block' : 'none'
    };
    let {sin, cos, round} = Math;
    let children = isVisible ? _.map(actions, (action) => {
      var itemStyle = {
        left:  round(sin(angularInterval * (i - 1)) * radius),
        top: round(cos(angularInterval * (i - 1)) * radius),
      };
      i -= 1;

      return (
        <div className='action-menu__item' style={itemStyle} key={i}>
          <RaisedButton label={action.label} onClick={action.handler} />
        </div>
      )
    }) : null;
    return (
      <div className='action-menu' style={containerStyle}
          onClick={this.close}>
        {children}
      </div>
    )
  }
  open() {
    this.setState({isVisible: true});
  }
  close() {
    this.setState({isVisible: false});
  }
  toggle() {
    this.setState({isVisible: !this.state.isVisible});
  }
};

export default ActionMenu;

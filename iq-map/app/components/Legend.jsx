'use strict'
import React, {Component, cloneElement} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import Draggable from 'react-draggable';
import {createSelector} from 'reselect';
import _ from 'lodash';
import Toggle from 'material-ui/lib/toggle';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import {setFilter} from '../actions/MapActionCreators';

class Legend extends Component {
  constructor (props) {
    super(props);
    this.toggleFilter = this.toggleFilter.bind(this);
  }
  render() {
    let {items, filter, dispatch, draggable} = this.props;
    let types = _.map(items, (type, key) => {
      let toggleFilter = this.toggleFilter.bind(null, type);
      let toggleSwitch =
        <Toggle defaultToggled={filter[type]} onToggle={toggleFilter} />;

      return  <ListItem key={type} primaryText={type} rightToggle={toggleSwitch}/>;
    });
    let LegendList = <div className='legend dropshadow' >
      <div className='legend__handle handle' />
      <List>{types}</List>
    </div>;

    if (draggable) {
      return <Draggable bounds='parent' start={{x: 20, y: 200}}>
        {LegendList}
      </Draggable>;
    } else {
      return {LegendList};
    }
  }
  toggleFilter(key) {
    let {filter, dispatch} = this.props;
    dispatch(setFilter({[key]: !filter[key]}));
  }
};

let selector = createSelector(
  (state) => state.filter,
  (filter) => ({
    filter,
  })
);

export default connect(selector)(Legend);

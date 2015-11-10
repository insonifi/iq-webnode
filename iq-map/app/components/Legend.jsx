'use strict'
import React, {Component, cloneElement} from 'react';
import Draggable from 'react-draggable'
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
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
    let {factories, filter, dispatch} = this.props;
    let items = _.map(factories, (factory, key) => {
      let toggleFilter = this.toggleFilter.bind(null, key);
      let toggleSwitch =
        <Toggle defaultToggled={filter[key]} onToggle={toggleFilter} />;

      return  <ListItem key={key} primaryText={key} rightToggle={toggleSwitch}/>;
    });

    return <div className='legend' >
      <div className='legend__handle handle' />
        <List>
          {items}
        </List>
    </div>
  }
  toggleFilter(key) {
    let {filter, dispatch} = this.props;
    dispatch(setFilter({[key]: !filter[key]}));
  }
};

let selector = createSelector(
  (state) => state.factories,
  (state) => state.filter,
  (factories, filter) => ({
    factories,
    filter,
  })
);

export default connect(selector)(Legend);

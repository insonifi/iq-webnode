'use strict'
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import _ from 'lodash';
import {stringToMap} from '../utils/misc';
const Table = require('material-ui/lib/table/table');
const TableBody = require('material-ui/lib/table/table-body');
const TableFooter = require('material-ui/lib/table/table-footer');
const TableHeader = require('material-ui/lib/table/table-header');
const TableHeaderColumn = require('material-ui/lib/table/table-header-column');
const TableRow = require('material-ui/lib/table/table-row');
const TableRowColumn = require('material-ui/lib/table/table-row-column');


class StateList extends Component {
  constructor (props) {
    super(props);
  }
  render() {
    let {factories, states, behaviours} = this.props;
    let stateList = _.map(states, (list, type) =>
          _.map(list, (s, id) =>
                <TableRow>
                  <TableRowColumn>{id}</TableRowColumn>
                  <TableRowColumn>{type}</TableRowColumn>
                  <TableRowColumn>{s ? behaviours[type].compositeState(s): ''}</TableRowColumn>
                </TableRow>)
    );
    return <div className='state-list' >
        <Table selectable={false}>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn tooltip='Object ID'>ID</TableHeaderColumn>
              <TableHeaderColumn tooltip='Object Type'>Type</TableHeaderColumn>
              <TableHeaderColumn tooltip='Object state'>Status</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stateList}
          </TableBody>
        </Table>
    </div>
  }
};

let selector = createSelector(
  (state) => state.factories,
  (state) => state.objects.states,
  (state) => state.objects.behaviours,
  (factories, states, behaviours) => ({
    factories,
    states,
    behaviours,
  })
);

export default connect(selector)(StateList);

'use strict'
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import _ from 'lodash';
import Table from 'material-ui/lib/table/table';
import TableBody from 'material-ui/lib/table/table-body';
import TableFooter from 'material-ui/lib/table/table-footer';
import TableHeader from 'material-ui/lib/table/table-header';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';


class StateList extends Component {
  constructor (props) {
    super(props);
  }
  render() {
    let {states} = this.props;
    let stateList = _.map(states, (list, type) =>
          _.map(list, (st, id) =>
                <TableRow>
                  <TableRowColumn>{id}</TableRowColumn>
                  <TableRowColumn>{type}</TableRowColumn>
                  <TableRowColumn>{Array.from(st).join()}</TableRowColumn>
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
        {JSON.stringify(states)}
    </div>
  }
};

let selector = createSelector(
  //(state) => state.factories,
  (state) => state.objects.states,
  //(state) => state.objects.behaviours,
  (states) => ({
    //factories,
    states,
    //behaviours,
  })
);

export default connect(selector)(StateList);

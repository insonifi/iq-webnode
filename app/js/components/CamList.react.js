/** @jsx React.DOM */ 

var 
MainSection = require('./MainSection.react'),
React = require('react'),
CamActions = require('../actions/CamActions'),
CamStore = require('../stores/CamStore'),
CamList = React.createClass({ 
  getInitialState: function() { 
    return CamStore.getCamList(); 
  },
  componentDidMount: function() { 
    CamStore.addChangeListener(this._onListChange); 
  },
  componentWillUnmount: function() { 
    CamStore.removeChangeListener(this._onListChange); 
  },
  render: function() {
    return (
      <div>
        <button onClick={this._onRefreshClick}>Fetch List</button>
        <MainSection camList={this.state.camList} />
      </div>
    );
  },
  _onListChange: function () {
    this.setState(CamStore.getCamList());
  },
  _onRefreshClick: function() { 
    CamActions.getCamList();
  } 
});

module.exports = CamList;

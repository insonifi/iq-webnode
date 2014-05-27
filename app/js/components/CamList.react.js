/** @jsx React.DOM */ 

var 
MainSection = require('./MainSection.react'),
React = require('react'),
CamStore = require('../stores/CamStore'),
getCamState = function () { 
  return { 
    allCams: CamStore.getAll() 
  };
},
CamList = React.createClass({ 
  getInitialState: function() { 
    return getCamState(); 
  },
  componentDidMount: function() { 
    CamStore.addChangeListener(this._onRefreshClick); 
  },
  componentWillUnmount: function() { 
    CamStore.removeChangeListener(this._onRefreshClick); 
  },
  render: function() {
    return (
      <div>
        <button onClick={this._onRefreshClick}>Refresh</button>
        <MainSection allCams={this.state.allCams} />
      </div>
    );
  }, 
  _onRefreshClick: function() { 
    this.setState(getCamState()); 
  } 
});

module.exports = CamList;

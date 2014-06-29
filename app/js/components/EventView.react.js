/** @jsx React.DOM */ 

var 
React = require('react'),
CamStore = require('../stores/CamStore'),
EventViewActions = require('../actions/EventViewActions'),
EventItem = require('./EventItem'),
getEventsState = function () {
  return {
      events: CamStore.getEvents()
    }
}
EventView = React.createClass({ 
  getInitialState: function() { 
    return getEventsState(); 
  },
  componentDidMount: function() { 
    CamStore.addEventsListener(this._updateEvents); 
  },
  componentWillUnmount: function() { 
    CamStore.removeEventsListener(this._updateEvents); 
  },
  render: function() {
    var events = this.state.events,
      list = [],
      i = events.length;
    for (; i--;) { 
      list.push(<EventItem event={events[i]} />); 
    } 

    return (
      <div>
        <ul id='event-view'>{list}</ul>
      </div>
    )
  },
  _updateEvents: function () {
    this.setState(getEventsState());
  }
});

module.exports = EventView;

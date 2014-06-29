/** @jsx React.DOM */ 

var React = require('react');
EventItem = React.createClass({
  propTypes: {
    event: React.PropTypes.object.isRequired
  },
  render: function () {
    var event = this.props.event;
    return (
      <li key={event.timestamp}>{event.type} {event.id} {event.action} {event.params}</li>
    );
  }
})

module.exports = EventItem;

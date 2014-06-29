var Plug = require('../plug.js'),
  AppDispatcher = require('../dispatcher/AppDispatcher'),
  CamConstants = require('../constants/CamConstants');

var EventViewActions = {
  handleEventAction: function (event) {
    event.timestamp = (new Date()).valueOf();
    AppDispatcher.handleEventAction({
      actionType: CamConstants.EVENTS_UPDATE,
      event: event
    })
  }
}; 

Plug.subscribeTo('/channel', EventViewActions.handleEventAction);

module.exports = EventViewActions;

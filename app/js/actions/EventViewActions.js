var AppDispatcher = require('../dispatcher/AppDispatcher'),
  CamConstants = require('../constants/CamConstants');

var EventViewActions = {
  handleEventAction: function (event) {
    AppDispatcher.handleEventAction({
      actionType: CamConstants.EVENTS_UPDATE,
      event: event
    })
  }
}; 



module.exports = EventViewActions;

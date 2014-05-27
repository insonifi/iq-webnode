var AppDispatcher = require('../dispatcher/AppDispatcher');
var CamConstants = require('../constants/CamConstants');

var CamActions = {
  refresh: function(text) {
    AppDispatcher.handleViewAction({
      actionType: CamConstants.CAM_REFRESH,
      list: list
    });
  },
  ping: function(id) {
    AppDispatcher.handleViewAction({
      actionType: CamConstants.CAM_PING,
      id: id
    });
  }, 

}; 

module.exports = CamActions;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var CamConstants = require('../constants/CamConstants');

var CamActions = {
  getCamList: function () {
    AppDispatcher.handleViewAction({
      actionType: CamConstants.CAM_GETLIST,
    });
  },
  pingCam: function (id) {
    AppDispatcher.handleViewAction({
      actionType: CamConstants.CAM_PING,
      id: id
    });
  },
  getSnapshot: function (id) {
    AppDispatcher.handleViewAction({
      actionType: CamConstants.CAM_GETSNAPSHOT,
      id: id
    });
  },
}; 

module.exports = CamActions;

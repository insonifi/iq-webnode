'use strict'
var MapDispatcher = require('../dispatcher/MapDispatcher');
var MapConstants = require('../constants/MapConstants');

var ActionTypes = MapConstants.ActionTypes;

module.exports = {

  handleServerMessage: function(message) {
    MapDispatcher.handleServerAction({
      type: ActionTypes.RECV_MSG,
      body: message
    });
  }

};

'use strict'
var MapDispatcher = require('../dispatcher/MapDispatcher');
var MapConstants = require('../constants/MapConstants');

var ActionTypes = MapConstants.ActionTypes;

module.exports = {

  send: function(message) {
    MapDispatcher.handleViewAction({
      type: ActionTypes.EVENT,
      body: message
    });
  }

};

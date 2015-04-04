'use strict'
var MapDispatcher = require('../dispatcher/MapDispatcher');
var MapConstants = require('../constants/MapConstants');

var ActionTypes = MapConstants.ActionTypes;

module.exports = {

  msg: function(message) {
    MapDispatcher.handleViewAction({
      type: ActionTypes.ACTION,
      message: message
    });
  }

};

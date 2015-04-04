'use strict'
var MapDispatcher = require('../dispatcher/MapDispatcher');
var MapConstants = require('../constants/MapConstants');

var ActionTypes = MapConstants.ActionTypes;

module.exports = {

  select: function(index) {
    MapDispatcher.handleViewAction({
      type: ActionTypes.LAYER_SELECT,
      index: index
    });
  },
  
  alarm: function(indexList) {
    MapDispatcher.handleViewAction({
      type: ActionTypes.LAYER_ALARM,
      list: indexList
    });
  }

};

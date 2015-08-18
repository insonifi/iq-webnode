'use strict'
var MapDispatcher = require('../dispatcher/MapDispatcher');
var MapConstants = require('../constants/MapConstants');

var ActionTypes = MapConstants.ActionTypes;

module.exports = {

  select: function(index) {
    MapDispatcher.handleViewAction({
      type: ActionTypes.LAYER_SELECT,
      index,
    });
  },
  
  alarm: function(indexList) {
    MapDispatcher.handleViewAction({
      type: ActionTypes.LAYER_ALARM,
      list: indexList
    });
  },
  updateFrame: function(frame) {
    MapDispatcher.handleViewAction({
      type: ActionTypes.FRAME,
      frame,
    });
  },
  
  updateLayerPosition: function(position) {
    MapDispatcher.handleViewAction({
      type: ActionTypes.LAYER_POSITION,
      position,
    });
  }

};

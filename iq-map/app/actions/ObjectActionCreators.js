'use strict'
var MapDispatcher = require('../dispatcher/MapDispatcher');
var MapConstants = require('../constants/MapConstants');
var IqNode = require('../utils/IqNode');

var ActionTypes = MapConstants.ActionTypes;

module.exports = {

  send: function(message) {
//    MapDispatcher.handleViewAction({
//      type: ActionTypes.REACT,
//      body: message
//    });
    IqNode.react(message);
  },
  
  requestState: function (type, id) {
    IqNode.requestState(type, id);
  },
};

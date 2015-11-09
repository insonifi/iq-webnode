'use strict'
var MapStore = require('../stores/MapStore');
var ActionTypes = require('../constants/MapConstants');
var IqNode = require('../utils/IqNode');

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

'use strict'
var WebSocket = require('ws');
var MapDispatcher = require('../dispatcher/MapDispatcher');
var MapConstants = require('../constants/MapConstants');
var ws = new WebSocket('ws://${host}:58888'.replace('${host}', window.location.hostname));


var ActionTypes = MapConstants.ActionTypes;

ws.onmessage = function (frame) {
  var message = JSON.parse(frame.data);
  MapDispatcher.handleServerAction({
    type: ActionTypes.RECV_MSG,
    body: message
  });
}


module.exports = {
  
  event: function(rawMessage) {
    rawMessage.msg = 'Event';
    ws.send(JSON.stringify(rawMessage));
  },

  react: function(rawMessage) {
    rawMessage.msg = 'React';
    ws.send(JSON.stringify(rawMessage));
  },
  
  requestState: function (type, id) {
    console.log('requested', type, id);
    this.event({
      type: 'CORE',
      action: 'GET_STATE',
      params: {
        objtype: type,
        objid: id
      }
    })
  }
};

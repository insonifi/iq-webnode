'use strict'
var keyMirror = require('react/lib/keyMirror');

module.exports = {

  ActionTypes: keyMirror({
    EVENT: null,
    REACT: null,
    RECV_MSG: null,
    CONFIG: null,
    LAYER_SELECT: null,
    LAYER_ALARM: null
  }),

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })

};

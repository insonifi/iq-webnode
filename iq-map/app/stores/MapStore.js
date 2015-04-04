'use strict'
var MapDispatcher = require('../dispatcher/MapDispatcher');
var MapConstants = require('../constants/MapConstants');
var IqNode = require('../utils/IqNode');
var MapConfig = require('../utils/MapConfig');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var ActionTypes = MapConstants.ActionTypes;
var CHANGE_EVENT = 'change';
var CONFIG = 'config';
var MSG = 'msg';

var _states = {};
var _mapConfig = {};
var _layerSelected = 0;
var _layerAlarmed= {};

var MapStore = _.assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  emitConfig: function() {
    this.emit(CONFIG);
  },
  emitStateUpdate: function() {
    this.emit(MSG);
  },
  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  
  addStateUpdateListener: function(callback) {
    this.on(MSG, callback);
  },

  removeStateUpdateListener: function(callback) {
    this.removeListener(MSG, callback);
  },
  
  addConfigListener: function(callback) {
    this.on(CONFIG, callback);
  },

  removeConfigListener: function(callback) {
    this.removeListener(CONFIG, callback);
  },
  
  requestMapConfig: function () {
    MapConfig.requestMapConfig('map.json');
  },
  
  getMapConfig: function () {
    return _mapConfig;
  },
  
  getState: function (type, id) {
    var state = _.chain(_states).result(type).result(id).value();
    if (state) {
      return state;
    } else {
//      IqNode.requestState(type, id);
      return {};
    }
  },
  
  getSelected: function () {
    return _layerSelected;
  },
  
  getAlarmed: function () {
    return _layerAlarmed;
  }

});

MapStore.dispatchToken = MapDispatcher.register(function(payload) {
  var action = payload.action;
  
  switch(action.type) {

    case ActionTypes.RECV_MSG:
      processMessage(action.body);
      updateAlarmedLayers();
      MapStore.emitStateUpdate();
      break;
      
    case ActionTypes.CONFIG:
      _mapConfig = action.config;
      MapStore.emitConfig();
      break;

    case ActionTypes.EVENT:
      IqNode.event(action.body);
      break;
      
    case ActionTypes.LAYER_SELECT:
      _layerSelected = action.index;
      MapStore.emitChange();
      break;
      
    default:
      // do nothing
  }

});

function processMessage (message) {
  var objectState = {};
  if (message.type === 'MAPGIS' && message.action === 'OBJECT_STATE') {
    var type = message.params.obj_type,
        id = message.params.obj_id,
        state = _(message.params.state.split(','))
          .reduce(function (result, item, key) {
            result[item] = true;
            return result;
          }, {});
    if (!_states[type]) { _states[type] = {}; }
    _states[type][id] = state;
  }
};

function updateAlarmedLayers () {
  _layerAlarmed = _(_mapConfig).reduce(function (result, n, key) {
    var config = n.config;
    var i = config.length - 1;
    var obj = {};
    var state = {};
    for (i; i > -1; i -= 1) {
      obj = config[i];
      state = MapStore.getState(obj.type, obj.id);
      if (state.Alarmed) {
        result[key] = true;
        break;
      }
    }
    return result;
  }, {});
};

module.exports = MapStore;
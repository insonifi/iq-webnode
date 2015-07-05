'use strict'
var React = require('react');
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
var behaviours = {};
var factories = {};
var requestTracker = {};


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
    MapConfig.requestMapConfig('map.csv');
  },
  
  registerFactory: function (component) {
    factories[component.displayName] = React.createFactory(component);
  },
  
  registerBehaviour: function (fsm) {
    behaviours[fsm.namespace] = fsm;
  },
  
  getFactory: function (type) {
    return factories[type];
  },
  
  getMapConfig: function () {
    return _mapConfig;
  },
  
  getState: function (type, id) {
    var path = [type, id].join('.');
    var fsmClient = _.get(_states, path);
    if (fsmClient) {
      if (!_.get(requestTracker, path)) {
        _.set(requestTracker, path, undefined);
      }
      return stringToMap(behaviours[type].compositeState(fsmClient));
    } else {
      if (!_.get(requestTracker, path)) {
        _.set(requestTracker, path, true);
        IqNode.requestState(type, id);
      }
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
      
    case ActionTypes.LAYER_SELECT:
      _layerSelected = action.index;
      MapStore.emitChange();
      break;
      
    default:
      // do nothing
  }

});

function processMessage (message) {
  var type, id, behaviour, fsm, path;
  if (message.type === 'ACTIVEX' && message.action === 'OBJECT_STATE') {
    type = message.params.objtype;
    id = message.params.objid;
    path = [type, id].join('.');
    behaviour = behaviours[message.params.objtype];
    var state = message.params.state.toLowerCase();    
    fsm = {type: type, id: id};
    behaviour.init(fsm, state);
    _.set(_states, path, fsm);
  } else {
    type = message.type;
    id = message.id;
    path = [type, id].join('.');
    behaviour = behaviours[type]
    fsm = _.get(_states, path);
    if (fsm) {
      behaviour.handle(fsm, message.action.toLocaleLowerCase());
    }
  }
  _.set(_states, path, fsm);
}

function updateAlarmedLayers () {
  _layerAlarmed = _(_mapConfig).reduce(function (result, n, key) {
    var config = n.config;
    var i = config.length - 1;
    var obj = {};
    var state = {};
    for (i; i > -1; i -= 1) {
      obj = config[i];
      state = MapStore.getState(obj.type, obj.id);
      if (state.alarmed) {
        result[key] = true;
        break;
      }
    }
    return result;
  }, {});
}

function stringToMap (stringState) {
  return _(stringState)
    .split('|')
    .reduce(function (result, item) {
      result[item] = true;
      return result;
    },{});
}

MapStore.requestMapConfig();

module.exports = MapStore;
'use strict'
import React from 'react';
import _ from 'lodash';
import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import mapApp from './reducers';
import {alarm} from '../actions/MapActionCreators';
import {requestState} from '../utils/IqNode';

//var MapDispatcher = require('../dispatcher/MapDispatcher');
//var IqNode = require('../utils/IqNode');
//var EventEmitter = require('events').EventEmitter;
//var _ = require('lodash');

//var {ActionTypes, PayloadSources} = MapConstants;
//var CHANGE_EVENT = 'change';
//var CONFIG = 'config';
//var MSG = 'msg';
//var FRAME = 'frame';
//var LAYER_POS = 'layer';

//var _states = {};
//var _mapConfig = {};
//var _layerSelected = 0;
//var _layerAlarmed = {};
//var DEFAULT_FRAME_POS = {
//  x: 0,
//  y: 0,
//  w: 0,
//  h: 0,
//};
//var DEFAULT_LAYER_POS = {
//  x: 0,
//  y: 0,
//  s: 0,
//};
//var behaviours = {};
//var factories = {};
//var requestTracker = {};

//var MapStore = _.assign({}, EventEmitter.prototype, {
//
//  emitChange: function() {
//    this.emit(CHANGE_EVENT);
//  },
//  emitConfig: function() {
//    this.emit(CONFIG);
//  },
//  emitStateUpdate: function() {
//    this.emit(MSG);
//  },
//  emitFrameChange: function() {
//    this.emit(FRAME);
//  },
//  emitLayerPositionChange: function() {
//    this.emit(LAYER_POS);
//  },
//
//  addChangeListener: function(callback) {
//    this.on(CHANGE_EVENT, callback);
//  },
//
//  removeChangeListener: function(callback) {
//    this.removeListener(CHANGE_EVENT, callback);
//  },
//
//  addStateUpdateListener: function(callback) {
//    this.on(MSG, callback);
//  },
//
//  removeStateUpdateListener: function(callback) {
//    this.removeListener(MSG, callback);
//  },
//
//  addConfigListener: function(callback) {
//    this.on(CONFIG, callback);
//  },
//
//  removeConfigListener: function(callback) {
//    this.removeListener(CONFIG, callback);
//  },
//
//  addFrameChangeListener: function(callback) {
//    this.on(FRAME, callback);
//  },
//
//  removeFrameChangeListener: function(callback) {
//    this.removeListener(FRAME, callback);
//  },
//
//  addLayerPositionChange: function(callback) {
//    this.on(LAYER_POS, callback);
//  },
//
//  removeLayerPositionChange: function(callback) {
//    this.removeListener(LAYER_POS, callback);
//  },
//
//  registerFactory: function (component) {
//    factories[component.displayName] = React.createFactory(component);
//  },
//
//  registerBehaviour: function (fsm) {
//    behaviours[fsm.namespace] = fsm;
//  },
//
//  requestMapConfig: function () {
//
//  },
//
//  getFactory: function (type) {
//    return factories[type];
//  },
//
//  getMapConfig: function () {
//    return _mapConfig;
//  },
//
//  getState: function (type, id) {
//    var path = [type, id].join('.');
//    var fsmClient = _.get(_states, path);
//    if (fsmClient) {
//      if (!_.get(requestTracker, path)) {
//        _.set(requestTracker, path, undefined);
//      }
//      return stringToMap(behaviours[type].compositeState(fsmClient));
//    } else {
//      if (!_.get(requestTracker, path)) {
//        _.set(requestTracker, path, true);
//        IqNode.requestState(type, id);
//      }
//      return {};
//    }
//  },
//
//  getSelected: function () {
//    return _layerSelected;
//  },
//
//  getAlarmed: function () {
//    return _layerAlarmed;
//  },
//
//  getFrame: function () {
//    return _mapFrame;
//  },
//
//  getLayerPosition: function () {
//    return _layerGeometry;
//  },
//
//});

//MapStore.dispatchToken = MapDispatcher.register(function(payload) {
//  var source = payload.source;
//  var action = payload.action;
//
//  switch(source) {
//    case PayloadSources.SERVER_ACTION:
//      switch(action.type) {
//        case ActionTypes.RECV_MSG:
//          processMessage(action.body);
//          updateAlarmedLayers();
//          MapStore.emitStateUpdate();
//          break;
//
//        case ActionTypes.CONFIG:
//          _mapConfig = action.config;
//          MapStore.emitConfig();
//          break;
//
//        default:
//          // do nothing
//      }
//      break;
//    case PayloadSources.VIEW_ACTION:
//      switch(action.type) {
//        case ActionTypes.LAYER_SELECT:
//            _layerSelected = action.index;
//            MapStore.emitChange();
//            break;
//
//        case ActionTypes.FRAME:
//          _mapFrame = action.frame;
//          MapStore.emitFrameChange();
//          break;
//
//        case ActionTypes.LAYER_GEOMETRY:
//          _layerGeometry = action.position;
//          MapStore.emitLayerPositionChange();
//          break;
//
//        default:
//          // do nothing
//      }
//    default:
//  }
//});
const STORE_KEY = 'storeAction';
localStorage.setItem(STORE_KEY, '');
function crossTabActions({ getState }) {
  return (next) => (action) => {
    // console.log('>>', action);
    if (action.type.indexOf('REGISTER') === -1) {
      localStorage.setItem(STORE_KEY, JSON.stringify(action));
    }
    // Call the next dispatch method in the middleware chain.
    let returnValue = next(action);

    // console.log('state after dispatch', getState());

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue;
  };
}
const logger = createLogger();
const createCrossTabStore = applyMiddleware(crossTabActions)(createStore);
const store = createCrossTabStore(mapApp);

window.addEventListener('storage', (e) => {
  if (e.key === STORE_KEY && e.newValue !== '') {
    let action = JSON.parse(e.storageArea[STORE_KEY]);
    // console.log('<<', action);
    store.dispatch(action);
    localStorage.setItem(STORE_KEY, '');
  }
}, false);

export default store;



/* utilities */
function stringToMap (stringState) {
  return _(stringState)
    .split('|')
    .reduce(function (result, item) {
      result[item] = true;
      return result;
    },{});
}
export function getObjectState(type, id) {
  let {states, behaviours} = store.getState().objects;
  let path = [type, id].join('.');
  let fsmClient = _.get(states, path);
  if (fsmClient) {
    return stringToMap(behaviours[type].compositeState(fsmClient));
  } else {
    return {}
  }
}

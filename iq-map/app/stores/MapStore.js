'use strict'
import React from 'react';
import _ from 'lodash';
import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import mapApp from './reducers';
import {alarm} from '../actions/MapActionCreators';
import {handleState} from '../actions/ServerActionCreators';
import {getState} from '../utils/misc';
import {react} from '../utils/IqNode';

const STORE_KEY = 'storeAction';
let lastAction = {};
function crossTabActions({ getState }) {
  return (next) => (action) => {
    if (action.type.slice(0, 5) === 'LAYER' && action !== lastAction) {
      notifyStore(action);
    //  localStorage.setItem(STORE_KEY, JSON.stringify(action));
    }
    // Call the next dispatch method in the middleware chain.
    let returnValue = next(action);

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue;
  };
}
const logger = createLogger();
const createCrossTabStore = applyMiddleware(crossTabActions /*logger*/)(createStore);
const store = createCrossTabStore(mapApp);

// window.addEventListener('storage', (e) => {
//   if (e.key === STORE_KEY && e.newValue) {
//     let action = JSON.parse(e.newValue);
//     store.dispatch(action);
//   }
// }, false);

function notifyStore(storeUpdate) {
  const msg = {
    type: 'OPCIE',
    action: 'FUNC',
    params: {
      'func_name': 'storeHandler',
      state: JSON.stringify(storeUpdate),
      'from_store': window.external.GetMySlaveId,
    },
  };
  react(msg);
};

window.storeHandler = (msg) => {
  if (msg.GetParam('from_store') !== window.external.GetMySlaveId) {
    lastAction = JSON.parse(msg.GetParam('state'));
    store.dispatch(lastAction);
  }
};

window.onobjectstate = (msg) => {
  store.dispatch(handleState(
        msg.GetParam('obj_type'),
        msg.GetParam('obj_id'),
        msg.GetParam('state')
        ));
};

export default store;

/* utilities */
export const getObjectState = (type, id) =>
  getState(store.getState().objects.states, type, id);

'use strict'
import React from 'react';
import _ from 'lodash';
import { createStore, applyMiddleware } from 'redux';
// import createLogger from 'redux-logger';
import mapApp from './reducers';
import {alarm} from '../actions/MapActionCreators';
import {requestState} from '../utils/IqNode';
import {getState} from '../utils/getstate';

const STORE_KEY = 'storeAction';
localStorage.setItem(STORE_KEY, '');
function crossTabActions({ getState }) {
  return (next) => (action) => {
    if (action.type.slice(0, 5) === 'LAYER') {
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
// const logger = createLogger();
const createCrossTabStore = applyMiddleware(crossTabActions)(createStore);
const store = createCrossTabStore(mapApp);

window.addEventListener('storage', (e) => {
  if (e.key === STORE_KEY && e.newValue) {
    let action = JSON.parse(e.newValue);
    // console.log('<<', action);
    store.dispatch(action);
    localStorage.setItem(STORE_KEY, '');
  }
}, false);

export default store;

/* utilities */
export const getObjectState = (type, id) =>
  getState.call(store.getState().objects, type, id);

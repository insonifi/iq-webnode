'use strict'
import ActionTypes from '../constants/MapConstants';

export function handleServerMessage(message) {
  return {
    type: ActionTypes.RECV_MSG,
    body: message
  };
};
export function handleState(objtype, objid, state) {
  return {
    type: ActionTypes.STATE,
    objtype,
    objid,
    state,
  };
};

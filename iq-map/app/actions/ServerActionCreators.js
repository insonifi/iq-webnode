'use strict'
import ActionTypes from '../constants/MapConstants';

export function handleServerMessage(message) {
  return {
    type: ActionTypes.RECV_MSG,
    body: message
  };
};

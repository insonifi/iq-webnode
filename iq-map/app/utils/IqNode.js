'use strict'
import WebSocket from 'ws';
import MapStore from '../stores/MapStore';
import {handleServerMessage} from '../actions/ServerActionCreators';
const ws = new WebSocket(`ws://${window.location.hostname}:58888`);

ws.onopen = () => requestState('CAM');

ws.onmessage = (LAYER_FRAME) => MapStore.dispatch(
  handleServerMessage(JSON.parse(LAYER_FRAME.data))
);


export function event(rawMessage) {
  rawMessage.msg = 'Event';
  ws.send(JSON.stringify(rawMessage));
};

export function react(rawMessage) {
  rawMessage.msg = 'React';
  ws.send(JSON.stringify(rawMessage));
};

export function requestState(type, id) {
  event({
    type: 'CORE',
    action: 'GET_STATE',
    params: {
      objtype: type || '',
      objid: id || '',
    }
  })
};

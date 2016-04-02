'use strict'
// import WebSocket from 'ws';
import _ from 'lodash';
import MapStore from '../stores/MapStore';

// const ws = new WebSocket(`ws://${window.location.hostname}:58888`);

// ws.onopen = () => requestState('CAM');

// ws.onmessage = (LAYER_FRAME) => MapStore.dispatch(
//   handleServerMessage(JSON.parse(LAYER_FRAME.data))
// );

export function toIntellectMsg(jsMessage) {
  const msg = window.external.CreateMsg();
  msg.SourceType = jsMessage.type;
  msg.SourceId = jsMessage.id;
  msg.Action = jsMessage.action;
  return _.reduce(jsMessage.params, (msg, val, key) => {
    msg.SetParam(key, val);
    return msg;
  }, msg);
}

export function event(jsMessage) {
//  if (window.external && window.external.NotifyEvent) {
    window.external.NotifyEvent(toIntellectMsg(jsMessage));
//  }
};

export function react(jsMessage) {
//  if (window.external && window.external.DoReact) {
    window.external.DoReact(toIntellectMsg(jsMessage));
//  }
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
export function requestStates(type) {
  event({
    type: 'OPCIE',
    id: window.external.GetMySlaveId,
    action: 'GET_STATES',
    params: {
      objtype: type,
      callback: 'onStates',
    }
  });
}

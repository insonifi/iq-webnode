'use strict'
import ActionTypes from '../constants/MapConstants';

export function selectLayer(index) {
  return {
    type: ActionTypes.LAYER_SELECT,
    index,
  };
};
export function alarm(indices) {
  return {
    type: ActionTypes.LAYER_ALARMED,
    indices
  };
};
export function updateFrame(frame) {
  return {
    type: ActionTypes.LAYER_FRAME,
    frame,
  };
};
export function updateLayer(position) {
  return {
    type: ActionTypes.LAYER_GEOMETRY,
    position,
  };
};
export function updateLayerCentre(point) {
  return {
    type: ActionTypes.LAYER_POINT,
    point,
  };
};
export function registerFactory(component) {
  return {
    type: ActionTypes.REGISTER_FACTORY,
    component,
  };
};
export function registerBehaviour(fsm) {
  return {
    type: ActionTypes.REGISTER_BEHAVIOUR,
    fsm,
  };
};
export function toggleSelector() {
  return {
    type: ActionTypes.TOGGLE_SELECTOR,
  };
};
export function fitLayer () {
  return {
    type: ActionTypes.LAYER_FIT,
  }
};
export function setFilter (filter) {
  return {
    type: ActionTypes.LAYER_FILTER,
    filter,
  }
};

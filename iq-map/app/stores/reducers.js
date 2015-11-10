import {createFactory} from 'react';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import _ from 'lodash';
import ActionTypes from '../constants/MapConstants';
import {getState} from '../utils/getstate';

function layerSelected (state=0, action) {
  switch (action.type) {
    case ActionTypes.LAYER_SELECT:
      return action.index;
    default:
      return state;
  }
}
const DEFAULT_FRAME_POS = {
 l: 0,
 t: 0,
 w: 0,
 h: 0,
};
function framePosition (state=DEFAULT_FRAME_POS, action) {
  switch (action.type) {
    case ActionTypes.LAYER_FRAME:
      return action.frame;
    default:
      return state;
  }
}
const DEFAULT_LAYER_POS = {
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  s: 1,
  minZ: 1,
};
function layerGeometry (state=DEFAULT_LAYER_POS, action) {
  let {x, y, w, h, s} = state;
  switch (action.type) {
    case ActionTypes.LAYER_GEOMETRY:
      return _.assign({}, state, action.position);
    case ActionTypes.LAYER_POINT:
      let {point} = action;
      return _.assign({}, state, {
        x: point.x / s - w / 2,
        y: point.y / s - h / 2,
      });
    case ActionTypes.LAYER_FIT:
      let s = Math.max(window.innerWidth / w, window.innerHeight / h);
      return {
        x: 0,
        y: 0,
        w,
        h,
        s,
        minZ: s,
      };
    default:
      return state;
  }
}
function factories (state={}, action) {
  switch (action.type) {
    case ActionTypes.REGISTER_FACTORY:
      let {component} = action;
      return _.assign({}, state,
                  {[component.prototype.displayName]: createFactory(component)});
    default:
      return state;
  }
}

const INITIAL_OBJECTS = {
  config: {},
  states: {},
  behaviours: {},
  alarmed: {}
};
function objects (state=INITIAL_OBJECTS, action) {
  switch (action.type) {
    case ActionTypes.REGISTER_BEHAVIOUR:
    {
      let {behaviours} = state;
      let {fsm} = action;
      let updateBehaviours = _.assign(behaviours, {
          [fsm.namespace]: fsm,
      });
      return _.assign({}, state, {
        behaviours: updateBehaviours,
      });
    }
    case ActionTypes.CONFIG:
    {
      return _.assign({}, state, {
        config: action.config
      });
    }
    case ActionTypes.RECV_MSG:
    {
      let {config, states, behaviours} = state;
      let type, id, behaviour, fsm, path;
      let message = action.body;
      let newStates = {};
      /**
       * Replace state (usually initialise)
       */
      if (message.type === 'ACTIVEX' && message.action === 'OBJECT_STATE') {
        let objState = message.params.state.toLowerCase();
        type = message.params.objtype;
        id = message.params.objid;
        path = [type, id];
        behaviour = behaviours[type];
        fsm = {type,id};
        behaviour.init(fsm, objState);
        newStates = _.set({}, path, fsm);
      /**
       * Handle state event
       */
      } else {
        type = message.type;
        id = message.id;
        path = [type, id];
        behaviour = behaviours[type];
        fsm = _.get(states, path);
        if (fsm) {
          behaviour.handle(fsm, message.action.toLocaleLowerCase());
          newStates = _.set({}, path, fsm);
        }
      }
      /**
       * Mark layers with alarmed objects
       */
      let alarmed = _(config).reduce((result, layer, key) => {
        let objects = layer.config;
        let i;
        let obj = {};
        let objstate = false;
        result[key] = false;
        for (i = objects.length - 1; i > -1; i -= 1) {
          obj = objects[i];
          objstate = getState.call(state, obj.type, obj.id);
          if (objstate.alarmed) {
            result[key] = true;
            break;
          }
        }
        return result;
      }, {});
      return _.merge({}, state, {
        states: _.merge({}, states, newStates),
        alarmed,
      });
    }
    default:
      return state;
  }
}
function selectorOpen (state=false, action) {
  switch (action.type) {
    case ActionTypes.TOGGLE_SELECTOR:
      return !state;
    default:
      return state;
  }
}
function SVG (state='', action) {
  switch (action.type) {
    case ActionTypes.SVG:
      return action.svg;
    default:
      return state;
  }
}

function filter (state={}, action) {
  switch (action.type) {
    case ActionTypes.REGISTER_FACTORY:
      let {component} = action;
      return _.assign({}, state,
                {[component.prototype.displayName]: true});
    case ActionTypes.LAYER_FILTER:
      return _.assign({}, state, action.filter);
    default:
      return state;
  }
}

const mapApp = combineReducers({
  objects,
  selectorOpen,
  layerSelected,
  framePosition,
  layerGeometry,
  factories,
  filter,
});

export default mapApp;

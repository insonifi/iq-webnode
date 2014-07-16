var AppDispatcher = require('../dispatcher/AppDispatcher'),
    EventEmitter = require('events').EventEmitter,
    CamConstants = require('../constants/CamConstants'),
    merge = require('react/lib/merge'),
    Plug = require('../plug.js'),
    CHANGE_EVENT = 'change',
    EVENT_RECEIVED = 'event',
    _camlist = {},
    _event_list  = [],
    updateEvents = function (message) {
      message.timestamp = (new Date()).valueOf();
      _event_list.push(message);
      _event_list = _event_list.slice(-10);
    },
    updateCamList = function (list) {
      _camlist = list;
    },
    handlers = {
      
    },
    CamStore = merge(EventEmitter.prototype, {
      emitEventReceived: function () {
        this.emit(EVENT_RECEIVED);
      },
      emitChange: function () {
        this.emit(CHANGE_EVENT);
      },
      addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
      },
      removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
      },
      addEventsListener: function (callback) {
        this.on(EVENT_RECEIVED, callback);
      },
      removeEventsListener: function (callback) {
        this.removeListener(EVENT_RECEIVED, callback);
      },
      handleEvent: function (message) {
        updateEvents(message);
        CamStore.emitEventReceived();
        
        if (message.type === 'CAM' && message.action === 'FRAME_SENT') {
          var cam = _camlist.filter(function(item) {
            return item.id === message.id
          });
          cam.frame = message.data;
        }
      },
      dispatcherIndex: AppDispatcher.register(function (payload) {
        var action = payload.action;
        switch (action.actionType) {
          case CamConstants.REFRESH:
            fetchCamList();
            break;
          case CamConstants.EVENTS_UPDATE:
            updateEvents(action.event);
            CamStore.emitEventReceived();
            break;
          case CamConstants.CAM_GETLIST:
            Plug.getconfig('CAM', '').then(function (list) {
              _camlist = list;
              CamStore.emitChange();
            });
            break;
          case CamConstants.CAM_GETSNAPSHOT:
            Plug.getsnapshot(action.id).then(function (frame) {
              var i = _camlist.length,
                cam;
              for (;i--;) {
                cam = _camlist[i];
                if (cam.id === action.id) {
                  cam.frame = frame;
                }
              }
              CamStore.emitChange();
            });
            break;
        }
        return true;
      })
    });
CamStore.getEvents = function () {
  return _event_list;
}
CamStore.getCamList = function () {
  return {
    camList: _camlist
  };
}
Plug.subscribeTo('/channel', CamStore.handleEvent);
module.exports = CamStore;

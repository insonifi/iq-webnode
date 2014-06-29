var AppDispatcher = require('../dispatcher/AppDispatcher'),
    EventEmitter = require('events').EventEmitter,
    CamConstants = require('../constants/CamConstants'),
    merge = require('react/lib/merge'),

    CHANGE_EVENT = 'change',
    EVENT_RECEIVED = 'event',
    _camlist = {},
    _event_list  = [],
    updateEvents = function (message) {
      _event_list.push(message);
      _event_list = _event_list.slice(-10);
    },
    updateCamList = function (list) {
      _camlist = list;
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
        }
        return true;
      })
    });
CamStore.getEvents = function () {
  return _event_list;
}
CamStore.getCamList = function () {
  return _camlist;
}
module.exports = CamStore;

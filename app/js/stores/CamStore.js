var AppDispatcher = require('../dispatcher/AppDispatcher'),
    EventEmitter = require('events').EventEmitter,
    CamConstants = require('../constants/CamConstants'),
    merge = require('react/lib/merge'),
    plug = require('../plug.js'),
    CHANGE_EVENT = 'change',
    _camlist = {},
    refresh = function (list) {
      _camlist = list;
    },
    CamStore = merge(EventEmitter.prototype, {
      getAll: function () {
        
        return _camlist;
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
      dispatcherIndex: AppDispatcher.register(function (payload) {
        var action = payload.action,
            list;
        
        switch (action.actionType) {
          case CamConstants.REFRESH:
            refresh()
            if (list) {
              refresh(list);
              CamStore.emitChange();
            }
            break;
        }
        return true;
      })
    });

module.exports = CamStore;

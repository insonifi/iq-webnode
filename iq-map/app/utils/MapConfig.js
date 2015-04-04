'use strict'
var MapDispatcher = require('../dispatcher/MapDispatcher');
var MapConstants = require('../constants/MapConstants');


var ActionTypes = MapConstants.ActionTypes;


module.exports = {
  
  requestMapConfig: function(file) {
    var p = new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      var url = '${loc}/${file}'
        .replace('${loc}', window.location)
        .replace('${file}', file);
      var ASYNC = true;
      xhr.open('GET', url, ASYNC);
      xhr.onreadystatechange = (function () {
        if (this.readyState === 4) {
          if (this.status === 200) {
            resolve(JSON.parse(this.response));
          } else {
            reject(this.status);
          }
        }
      }).bind(xhr);
      xhr.send();
    });
    
    p.then(function (config) {
      MapDispatcher.handleServerAction({
        type: ActionTypes.CONFIG,
        config: config
      });
    });
  }
  
}
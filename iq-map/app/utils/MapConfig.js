'use strict'
var MapDispatcher = require('../dispatcher/MapDispatcher');
var MapConstants = require('../constants/MapConstants');
var workerBlob = new Blob([require('raw!./csvWorker')]);
var blobURL = URL.createObjectURL(workerBlob);
var csvProcessor = new Worker(blobURL);


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
            csvProcessor.postMessage(this.response);
            csvProcessor.onmessage = function(e) {
              resolve(e.data);
            };
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

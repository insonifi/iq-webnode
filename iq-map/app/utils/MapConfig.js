'use strict'
// var MapDispatcher from '../dispatcher/MapDispatcher');
import ActionTypes from '../constants/MapConstants';
import MapStore from '../stores/MapStore';
const workerBlob = new Blob([require('raw!./csvWorker')]);
const blobURL = URL.createObjectURL(workerBlob);
const csvProcessor = new Worker(blobURL);

export default (file) => {
  let p = new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    const url = `${window.location}/${file}`;
    const ASYNC = true;
    xhr.open('GET', url, ASYNC);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          csvProcessor.postMessage(xhr.response);
          csvProcessor.onmessage = (e) => resolve(e.data);
        } else {
          reject(this.status);
        }
      }
    };
    xhr.send();
  });

  p.then((config) => {
    MapStore.dispatch({
      type: ActionTypes.CONFIG,
      config,
    });
  });
}

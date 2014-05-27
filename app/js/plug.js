var Promise = require('es6-promise').Promise,
  Plug = {},
  _promises = [],
  _callbacks = [],
  client = new Faye.Client('http://localhost:8080/iq'),
  subscription = client.subscribe('/channel', function(message) {
    console.log(message);
  });

Plug.getconfig = function (type, id) {
  _promises.push(new Promise(function (resolve, reject) {
    resolve(callback);
  }));
  client.publish('/getconfig', {type: type, id: id});
}

client.subscribe('/config', function(message) {
  console.log('Config:', message);
});
client.subscribe('/state', function(message) {
  console.log('State:', message);
});

module.exports = Plug

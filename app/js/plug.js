var Promise = require('es6-promise').Promise,
  Plug = {},
  client = new Faye.Client('http://localhost:8080/iq');

Plug.getconfig = function (type, id) {
  return new Promise(function (resolve, reject) {
    var subscribe = client.subscribe('/config', function(message) {
      resolve(message);
      subscribe.cancel();
    });
    client.publish('/getconfig', {type: type, id: id});
  });
}
Plug.getstate = function (type, id) {
  return new Promise(function (resolve, reject) {
    var subscribe = client.subscribe('/state', function(message) {
      resolve(message);
      subscribe.cancel();
    });
    client.publish('/getstate', {type: type, id: id});
  });
}
Plug.getsnapshot = function (id) {
  return new Promise(function (resolve, reject) {
    var subscribe = client.subscribe('/frame', function(message) {
      resolve(message);
      subscribe.cancel();
    });
    client.publish('/react', {type: 'CAM', id: id, action: 'GET_FRAME'});
  });
}
Plug.subscribeTo = function (channel, fn) {
  var subscription = client.subscribe(channel, function (message) {
    fn(message);
  })
  return subscription;
}


module.exports = Plug;

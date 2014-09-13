var http = require('http'),
  iq = require('iq-node'),
  server = http.createServer(),
  WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({port: 8080}),
  express = require('express'),
  app = express();

app.use(express.static('iq-webnode-app'))
app.use(function(req, res, next){
  res.status(404).send('Sorry cant find that!');
});
app.listen(8000);

wss.broadcast = function (message) {
  var clients = Object.keys(this.clients),
      i = clients.length;
  for (; i--;) {
    this.clients[clients[i]].send(message);
  }
}


iq.connect({ip: '192.168.122.183', iidk: '3', host: 'DUKE-PC'})
.then(function () {
  iq.on({}, function (msg) {
    console.log(msg.type, msg.id, msg.action);
    wss.broadcast(JSON.stringify(msg));
  });
}, function (e) { console.log(e); });
//iq.listen('iidk');

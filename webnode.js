var http = require('http'),
  iq = require('iq-node'),
  server = http.createServer(),
  WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({port: 8787}),
  express = require('express'),
  app = express();

app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});
  
app.use(express.static('iq-map'));

app.use(function (req, res, next){
  res.status(404).send('Sorry cant find that!');
});

app.listen(8000);

wss.broadcast = function (message) {
  var clients = Object.keys(this.clients),
      i = clients.length;
  while(i--) {
    this.clients[clients[i]].send(JSON.stringify(message));
  }
}
wss.on('connection', function (ws) {
  ws.on('message', function (message) {
    var p_message = JSON.parse(message);
    if (p_message.msg === 'Event') {
      iq.sendEvent(p_message);
    }
    if (p_message.msg === 'React') {
      iq.sendCoreReact(p_message);
    }
  });
})
iq.on({}, function (msg) {
  //console.log(msg.type, msg.id, msg.action);
  wss.broadcast(msg);
});
iq.connect({ip: '192.168.122.183', iidk: '0', host: 'DUKE-PC'})
.then(function () {
}, function (e) { console.log(e); });
//iq.listen('iidk');

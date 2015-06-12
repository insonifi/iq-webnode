var http = require('http'),
  fs = require('fs'),
  os = require('os'),
  dns = require('dns'),
  iq = require('iq-node'),
  config = JSON.parse(fs.readFileSync(__dirname + '/config.json'));
  server = http.createServer(),
  WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({port: 58888}),
  express = require('express'),
  app = express();

app.get('*.js', function (req, res, next) {
//  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});
  
app.use(express.static(__dirname + '/iq-map'));

app.use(function (req, res, next){
  res.status(404).send('Sorry cant find that!');
});

app.listen(config.httpPort || 8000);
console.log('HTTP: %s\nWS: %s', config.httpPort || 8000, 58888);
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
if (config.ip === '127.0.0.1') {
  config.host = os.hostname().toUpperCase();
  connect(config);
} else {
  dns.reverse(config.ip, function (err, hostnames) {
    if (!(hostnames || config.host)) {
      console.log('Hostname wasn\'t provided and cannot be acquired.');
      process.exit(1);
    }
    config.host = config.host || hostnames[0].toUpperCase();
    connect(config);
  });
}

function connect(config) {
  iq.connect(config)
  .then(function () {}, function (e) {
    console.log(e);
  });
}

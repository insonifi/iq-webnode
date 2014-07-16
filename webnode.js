var http = require('http'),
  iq = require('iq-node'),
  server = http.createServer(),
  faye = require('faye'),
  bayeux = new faye.NodeAdapter({mount: '/iq', timeout: 45}),
  operator = bayeux.getClient(),
  express = require('express'),
  app = express();

app.use(express.static('app'))
app.use(function(req, res, next){
  res.send(404, 'Sorry cant find that!');
});
bayeux.attach(server);
server.listen(8080);
app.listen(8000);

operator.subscribe('/getconfig', function (req) {
  req.prop = 'CONFIG';
  iq.get(req).then(function (list) {
    operator.publish('/config', list);
  })
});
operator.subscribe('/getstate', function (req) {
  req.prop = 'STATE';
  iq.get(req).then(function (list) {
    operator.publish('/state', list);
  })
});
operator.subscribe('/event', function (msg) {
  iq.sendEvent(msg);
});
operator.subscribe('/react', function (msg) {
  iq.sendCoreReact(msg);
});

iq.connect({ip: '192.168.100.168', iidk: '1', host: 'GATE'});
//iq.listen('iidk');
iq.on({}, function (msg) {
  if (msg.msg = 'Event') {
    operator.publish('/channel', msg);
  }
});
iq.on({type: 'CAM', action: 'FRAME_SENT'}, function (msg) {
  operator.publish('/frame', msg.params.data);
})

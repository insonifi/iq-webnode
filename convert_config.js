var fs = require('fs');
var Emitter = require('events').EventEmitter;
var event = new Emitter();
var output = '';
fs.readFile('iq-map/map.json', {encoding: 'utf8'}, function (err, data) {
  var mapConfig = JSON.parse(data);
  output = mapConfig.reduce(function (result, item, index, array) {
    result.push([index, 'LAYER', item.name, item.bg].join());
    var config = item.config;
    var i = config.length;
    var o = {};
    while (i--) {
      o = config[i];
      result.push([index, o.type, o.config.id, o.config.name, o.config.x, o.config.y].join());
    }
    return result;
  }, []).join('\n');
  event.emit('converted', output);
});

event.on('converted', function(output) {
  fs.writeFile('iq-map/map.csv', output, function (err) {
      console.log('converted!');
  });
});
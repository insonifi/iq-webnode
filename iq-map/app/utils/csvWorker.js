'use strict'
onmessage = function (e) {
  var csv = e.data.split('\n');
  var config = [];
  var length = csv.length;
  var idx = 0;
  var layer = -1;
  for (idx = 0; idx < length; idx += 1) {
    if (csv[idx].length === 0) continue;
    var params = csv[idx].split(',');
    var id = params[0];
    var type = params[1].toUpperCase();
    var name = params[2];
    var x = params[3];
    var bg = params[3];
    var y = params[4];
    if (type === 'LAYER') {
      config.push({
        name: name,
        bg: bg, 
        config: [],
      });
      layer += 1;
      continue;
    }
    config[layer].config.push({
      id: id,
      type: type,
      name: name,
      x,
      y,
    });
  }
  postMessage(config);
}
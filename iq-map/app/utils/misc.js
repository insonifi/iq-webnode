export function stringToMap (stringState) {
  return _(stringState)
    .split('|')
    .reduce(function (result, item) {
      result[item] = true;
      return result;
    },{});
}
export function getState(type, id) {
  let {states, behaviours} = this;
  let path = [type, id].join('.');
  let fsmClient = _.get(states, path);
  if (fsmClient) {
    return stringToMap(behaviours[type].compositeState(fsmClient));
  } else {
    return {}
  }
}
export function boundedPosition(x, y) {
  let bx = x;
  let by = y;
  var {w, h, s} = this;
  var scaledWidth = w * s;
  var scaledHeight = h * s;
  bx = Math.min(bx, 0);
  by = Math.min(by, 0);
  bx = Math.max(bx, window.innerWidth - scaledWidth);
  by = Math.max(by, window.innerHeight - scaledHeight);
  return {bx, by};
}

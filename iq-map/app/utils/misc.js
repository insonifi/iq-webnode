export function stringToMap (stringState) {
  return _(stringState)
    .split('|')
    .reduce(function (result, item) {
      result[item] = true;
      return result;
    },{});
}
export function getState(states, type, id) {
//  let fsmClient = _.get(states, path);
//  if (fsmClient) {
//    return stringToMap(behaviours[type].compositeState(fsmClient));
//  } else {
//    return {};
//  }
  return _.get(states, [type, id], new Set);
}
export function boundedPosition(x, y) {
  const {w, h, s} = this;
  const scaledWidth = w * s;
  const scaledHeight = h * s;
  let bx = x;
  let by = y;
  bx = Math.min(bx, 0);
  by = Math.min(by, 0);
  bx = Math.max(bx, window.innerWidth - scaledWidth);
  by = Math.max(by, window.innerHeight - scaledHeight);
  return {bx, by};
}

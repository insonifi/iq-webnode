function stringToMap (stringState) {
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

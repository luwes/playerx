export function serialize(props) {
  return Object.keys(props)
    .map((key) => `${key}=${encodeURIComponent(props[key])}`)
    .join('&');
}

export function boolToBinary(props) {
  for (let key in props) {
    if (props[key] === false) props[key] = 0;
    else if (props[key] === true) props[key] = 1;
  }
  return props;
}

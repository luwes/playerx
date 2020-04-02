
export function serialize(props) {
  return new URLSearchParams(props);
}

export function boolToBinary(props) {
  for (let key in props) {
    if (props[key] === false) props[key] = 0;
    else if (props[key] === true) props[key] = 1;
  }
  return props;
}


export function serialize(props) {
  for (let key in props) {
    if (props[key] === false) props[key] = 0;
    else if (props[key] === true) props[key] = 1;
  }
  return new URLSearchParams(props);
}

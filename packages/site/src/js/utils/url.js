export function getParam(key, defaultValue) {
  const params = new URLSearchParams(location.search);
  return params.has(key)
    ? params.get(key) === '1'
      ? true
      : params.get(key) === '0'
      ? false
      : params.get(key)
    : defaultValue;
}

export function getParams() {
  return Object.fromEntries(new URLSearchParams(location.search));
}

export function toParams(obj, defaults) {
  const values = {};
  for (let key in obj) {
    let value = typeof obj[key] === 'function' ? obj[key]() : obj[key];
    if (typeof defaults[key] === 'boolean') value = !!value;
    if (value == defaults[key]) continue;

    if (value === undefined) delete values[key];
    else if (value === true) values[key] = 1;
    else if (!value) values[key] = 0;
    else values[key] = value;
  }
  return new URLSearchParams(values);
}

export function toQuery(obj, defaults) {
  const params = toParams(obj, defaults).toString();
  return params ? '?' + params : '';
}

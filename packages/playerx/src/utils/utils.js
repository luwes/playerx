
export function bindAll(methodNames, obj) {
  methodNames.forEach(name => {
    if (name in obj) obj[name] = obj[name].bind(obj);
  });
  return obj;
}

export function replaceKeys(map, keys) {
  return keys.map(key => map[key] || key);
}

export const once = fn => () => {
  if (!fn) return;
  fn();
  fn = null;
};

export function clamp(min, max, value) {
  return value < min ? min : value > max ? max : value;
}

export function isMethod(instance, name) {
  return instance && typeof instance[name] === 'function';
}

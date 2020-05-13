export const assign = Object.assign;

export function pick(names, obj) {
  let result = {};
  names.forEach(name => {
    if (name in obj) result[name] = obj[name];
  });
  return result;
}

export function omit(names, obj) {
  return names.reduce((newObj, val) => // eslint-disable-next-line
    (({ [val]: dropped, ...rest }) => rest)(newObj), obj);
}

export function getEntry(obj) {
  for (let name in obj) return [name, obj[name]];
}

export function getPropertyDescriptor(obj, key) {
  return obj && (Object.getOwnPropertyDescriptor(obj, key)
    || getPropertyDescriptor(Object.getPrototypeOf(obj), key));
}

/**
 * Extend is used to copy the values of all enumerable properties
 * from one or more source objects to a target object, including getters and setters.
 * It will return the target object.
 * Properties are still allowed to be overridden.
 *
 * @param  {Object} target
 * @param  {...Object} sources
 * @return {Object} The target with assigned properties
 */
export const extend = createCompleteAssign({
  enumerable: true,
  configurable: true,
  writeable: false
});

/**
 * Create a complete assign function with custom descriptors.
 * @param  {Object} options - The custom descriptor options.
 * @return {Function}
 */
export function createCompleteAssign(options) {
  return (target, ...sources) => {
    sources.forEach(source => {
      Object.keys(source || {}).forEach(prop => {
        const descriptor = Object.getOwnPropertyDescriptor(source, prop);
        Object.defineProperty(target, prop, assign(descriptor, options));
      });
    });
    return target;
  };
}

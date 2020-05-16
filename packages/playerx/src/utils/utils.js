
export function clamp(min, max, value) {
  return value < min ? min : value > max ? max : value;
}

export function getProperty(instance, name) {
  let result;
  if (instance
    && name in instance
    && (result = instance[name]) !== undefined
    && typeof result !== 'function'
  ) {
    return result;
  }
}

export function getMethod(instance, name) {
  if (isMethod(instance, name)) {
    return instance[name]();
  }
}

export function isMethod(instance, name) {
  return instance && typeof instance[name] === 'function';
}

/**
 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
 *
 * @param {string} prefix The value to prefix the ID with.
 * @return {string} Returns the unique ID.
 * @example
 *
 *    uniqueId('contact_');
 *    // => 'contact_104'
 *
 *    uniqueId();
 *    // => '105'
 */
let idCounter = 0;
export function uniqueId(prefix) {
  let id = ++idCounter;
  return `${prefix}${id}`;
}

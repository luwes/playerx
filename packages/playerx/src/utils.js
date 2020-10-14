let style;
export function getStyle() {
  if (!style) {
    style = document.head.appendChild(createElement('style'));
    style.innerHTML = ' ';
  }
  return style;
}

export function addCssRule(selector, props = {}) {
  const rule = `${selector}{${Object.keys(props)
    .map(prop => `${prop}:${cssNumber(props[prop], prop)};`)
    .join('')}}`;
  const sheet = getStyle().sheet;
  return sheet.cssRules[sheet.insertRule(rule, sheet.cssRules.length)];
}

export function deleteCssRule(rule) {
  const sheet = getStyle().sheet;
  sheet.deleteRule(cssRuleIndex(rule));
}

export function cssRuleIndex(rule) {
  const sheet = getStyle().sheet;
  for (let i = 0; i < sheet.cssRules.length; i++) {
    if (sheet.cssRules[i] === rule) return i;
  }
  return -1;
}

export function cssNumber(number, property) {
  if (number === 0 ||
    property === 'z-index' ||
    property === 'opacity') {
    return '' + number;
  }
  if (parseInt(number) + '' == number) number += 'px';
  return number;
}

export function createElement(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  Object.keys(attrs).forEach(name =>
    attrs[name] != null && el.setAttribute(name, attrs[name]));
  children.forEach(child => el.appendChild(child));
  return el;
}

/**
 * Remove a child node from its parent if attached. This is a workaround for
 * IE11 which doesn't support `Element.prototype.remove()`. Using this function
 * is smaller than including a dedicated polyfill.
 * @param {Node} node The node to remove
 */
export function removeNode(node) {
  let parentNode = node.parentNode;
  if (parentNode) parentNode.removeChild(node);
}

export function loadScript(src, globalName, readyFnName) {
  if (globalName && self[globalName]) {
    return Promise.resolve(self[globalName]);
  }

  return new Promise(function(resolve, reject) {
    const script = createElement('script', {
      src,
      defer: '',
      async: '',
    });

    const ready = () => resolve(self[globalName]);
    if (readyFnName) {
      self[readyFnName] = ready;
    }

    script.onload = () => {
      removeNode(script);
      if (!readyFnName) {
        ready();
      }
    };

    script.onerror = function(error) {
      removeNode(script);
      reject(error);
    };

    document.head.appendChild(script);
  });
}

export const assign = Object.assign;

export function omit(names, obj) {
  return names.reduce((newObj, val) => // eslint-disable-next-line
    (({ [val]: dropped, ...rest }) => rest)(newObj), obj);
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

/**
 * A utility to create Promises with convenient public resolve and reject methods.
 * @return {Promise}
 */
export function publicPromise() {
  let resolvePromise;
  let rejectPromise;

  let promise = new Promise(function(resolve, reject) {
    resolvePromise = resolve;
    rejectPromise = reject;
  });

  promise.resolve = (...args) => (resolvePromise(...args), promise);
  promise.reject = (...args) => (rejectPromise(...args), promise);

  return promise;
}

export function promisify(fn, ctx) {
  return (...args) => new Promise((resolve) => {
    // fn.call() didn't work for some reason.
    fn.bind(ctx)(...args, (...res) => {
      if (res.length > 1) resolve(res);
      else resolve(res[0]);
    });
  });
}

/**
 * Returns a promise that will resolve after passed ms.
 * @param  {number} ms
 * @return {Promise}
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function requestJson(url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open('GET', url);
    req.send();
    req.onload = function() {
      resolve(JSON.parse(req.responseText));
    };
    req.onerror = reject;
  });
}

export function startCase(s) {
  return s[0].toUpperCase() + s.slice(1);
}

export function camelCase(name) {
  return name.replace(/[-_]([a-z])/g, ($0, $1) => $1.toUpperCase());
}

export function kebabCase(name) {
  return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Creates a fake `TimeRanges` object.
 *
 * A TimeRanges object. This object is normalized, which means that ranges are
 * ordered, don't overlap, aren't empty, and don't touch (adjacent ranges are
 * folded into one bigger range).
 *
 * @param  {(Number|Array)} Start of a single range or an array of ranges
 * @param  {Number} End of a single range
 * @return {Array}
 */
export function createTimeRanges(start, end) {
  if (Array.isArray(start)) {
    return createTimeRangesObj(start);
  } else if (start == null || end == null || (start === 0 && end === 0)) {
    return createTimeRangesObj([]);
  }
  return createTimeRangesObj([[start, end]]);
}

export { createTimeRanges as createTimeRange };

function createTimeRangesObj(ranges) {
  Object.defineProperties(ranges, {
    start: {
      value: i => ranges[i][0]
    },
    end: {
      value: i => ranges[i][1]
    }
  });
  return ranges;
}

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

export function objectValues(o) {
  return Object.keys(o).map(k=>o[k]);
}

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

export function findAncestor(el, sel) {
  while ((el = el.parentElement) && !el.matches(sel));
  return el;
}

import { kebabCase, camelCase } from './utils.js';

export const css = function (strings, ...values) {
  let str = '';
  strings.forEach((string, i) => {
    str += string + (values[i] || '');
  });
  return str;
};

export class PlxElement extends HTMLElement {
  static props = {};

  static get observedAttributes() {
    if (!this.prototype._propConfigs) {
      this.prototype._propConfigs = {};
    }

    const keys = Object.keys(this.props);
    keys.forEach((key) => this.defineProp(key, this.props[key]));
    return keys;
  }

  static defineProp(key, config) {
    const type = typeof config;
    if (type !== 'object' || config === null || Array.isArray(config)) {
      config = property(config);
    }

    this.prototype._propConfigs[key] = config;

    const descriptor = {
      get() {
        return this.getProp(key);
      },
      set:
        config.set &&
        function (value) {
          this.set(key, value);
        },
      enumerable: true,
      configurable: true,
    };

    Object.defineProperty(this.prototype, key, descriptor);
  }

  constructor() {
    super();
    this._cache = {};
  }

  get(name) {
    return this.getProp(name);
  }

  set(name, value) {
    const oldValue = this._getProp(name);
    this.setProp(name, value, oldValue);
  }

  getProp(name) {
    return this._getProp(name);
  }

  setProp(name, value) {
    // Read-only props don't have a config.set but
    // should still be update-able by setProp.
    if (this._propConfigs[name] && this._propConfigs[name].set) {
      value = this._propConfigs[name].set(this, value, this._cache[name], this._cache);
    }

    this._cache[name] = value;

    if (this._ignorePropChange) return;
    this._updateAttr(name);
  }

  _getProp(name) {
    if (this._propConfigs[name] && this._propConfigs[name].get) {
      return this._propConfigs[name].get(this, this._cache[name], this._cache);
    }
    return this._cache[name];
  }

  _updateAttr(name) {
    this._ignoreAttributeChange = true;
    this._propToAttr(name);
    this._ignoreAttributeChange = false;
  }

  _propToAttr(propName) {
    const config = this._propConfigs[propName];
    let value = this._getProp(propName);

    if (value === undefined || !config.reflect) return;

    if (value == null || value === false) {
      this.removeAttribute(kebabCase(propName));
    } else {
      value = (config.toAttribute || toAttribute)(value, config);
      this.setAttribute(kebabCase(propName), '' + value);
    }
  }

  connectedCallback() {
    Object.keys(this._propConfigs).forEach((name) => {
      this.attributeChangedCallback(name, null, this.getAttribute(name));
    });
  }

  disconnectedCallback() {}

  attributeChangedCallback(name, oldValue, value) {
    if (this._ignoreAttributeChange) {
      return;
    }

    if (oldValue !== value) {
      this._ignorePropChange = true;

      const propName = camelCase(name);
      const config = this._propConfigs[propName];
      this[propName] = (config.fromAttribute || fromAttribute)(
        value,
        config
      );

      this._ignorePropChange = false;
    }
  }
}

export function defineCustomElement(name, element) {
  if (!window.customElements.get(name)) {
    window.customElements.define(name, element);
    window[element.name] = element;
  }
}

export function property(value, options) {
  const config = {
    value,
    toAttribute,
    fromAttribute,
    get: (host, val = config.value) => val,
    set: (host, val) => val,
    ...options,
  };
  return config;
}

export function toAttribute(val, config) {
  const defaultPropValue = config.value;
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute
  // Boolean attributes are considered to be true if they're present on
  // the element at all, regardless of their actual value; as a rule,
  // you should specify the empty string ("") in value.
  if (defaultPropValue === false || defaultPropValue === true) val = '';

  return val;
}

export function fromAttribute(val, config) {
  const defaultPropValue = config.value;
  if (defaultPropValue === false || defaultPropValue === true) {
    return val != null;
  } else if (val != null && typeof defaultPropValue === 'number') {
    return Number(val);
  }
  return val;
}

export function readonly(props) {
  for (let prop in props) {
    props[prop] = property(props[prop], { set: undefined });
  }
  return props;
}

export function reflect(props) {
  for (let prop in props) {
    props[prop] = property(props[prop], { reflect: true });
  }
  return props;
}

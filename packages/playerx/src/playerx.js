import { defaultProps, defaultPropNames } from './defaults.js';
import {
  getName,
  setName,
  isBooleanProp,
  toPropDefaultTo,
  attrToProp
} from './helpers/index.js';
import {
  assign,
  publicPromise,
  getAttrsAsProps,
  camelCase,
  kebabCase
} from './utils/index.js';

// defaultProps are also transformed to core methods.
export const coreMethodNames = [
  'set',
  'get',
  'on',
  'off',
  'ready',
  'play',
  'pause',
  'stop',
  'destroy',
  'getPaused',
  'getDuration',
  'getEnded',
  'getCurrentTime',
  'setCurrentTime',
  'getVolume',
  'setVolume',
  'getVideoWidth',
  'getVideoHeight'
];

export const allMethodNames = [
  ...coreMethodNames,
  ...defaultPropNames.map(getName),
  ...defaultPropNames.map(setName)
];

export function playerx(createPlayer, element, options = {}) {
  const api = {};
  const promises = {};
  const tick = publicPromise();
  let ready = publicPromise();
  let player;

  // Attributes can not be set in the constructor, wait one tick.
  tick
    ._resolve()
    .then(() =>
      Object.keys(options).forEach(propName =>
        api[setName(propName)](options[propName])
      )
    );

  const internalMethods = {
    async _connected() {},
    async _disconnected() {},

    async _attributeChanged(attrName, oldValue, newValue) {
      if (oldValue != newValue) {
        if (attrName === 'src' && (!player || !player.f.canPlay(newValue))) {
          loadPlayer();
        } else {
          await ready;
          setProp(attrName, newValue);
        }
      }
    },

    async getSrc() {
      await tick;
      return toPropDefaultTo(element, defaultProps, 'src');
    },

    async getWidth() {
      await tick;
      return toPropDefaultTo(element, defaultProps, 'width');
    },

    async getHeight() {
      await tick;
      return toPropDefaultTo(element, defaultProps, 'height');
    },

    async getAspectRatio() {
      await tick;
      return toPropDefaultTo(element, defaultProps, 'aspect-ratio');
    },

  };

  async function loadPlayer() {
    let oldPlayer = player;
    if (oldPlayer) {
      ready = publicPromise();
    }

    const props = assign(options, defaultProps, getAttrsAsProps(element));
    player = createPlayer(element, props);

    if (oldPlayer) {
      element.replaceChild(player._element, oldPlayer._element);
    } else {
      element.append(player._element);
    }

    await player.ready();
    ready._resolve();
  }

  async function setProp(attrName, value) {
    value = attrToProp(defaultProps, attrName, value);

    const propName = camelCase(attrName);
    const promise = promises[propName];
    if (promise) {
      delete promises[propName];
      const result = await player.set(propName, value);
      promise._resolve(result);
    } else {
      player.set(propName, value);
    }
  }

  function createMethods() {
    const methods = {};

    defaultPropNames.forEach(propName => {
      methods[getName(propName)] = async function() {
        await ready;
        return player.get(propName);
      };

      methods[setName(propName)] = async function(value) {
        promises[propName] = publicPromise();
        if (value == null || value === false) {
          element.removeAttribute(kebabCase(propName));
        } else {
          if (isBooleanProp(defaultProps, propName)) value = '';
          element.setAttribute(kebabCase(propName), '' + value);
        }
        return promises[propName];
      };
    });

    coreMethodNames.forEach(name => {
      methods[name] = async function(...args) {
        await ready;
        return player[name](...args);
      };
    });

    return methods;
  }

  return assign(api, createMethods(), internalMethods);
}

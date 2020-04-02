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
  completeAssign,
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
  'getVideoWidth',
  'getVideoHeight',
];

export const methodNames = [
  ...coreMethodNames,
  ...defaultPropNames.map(getName),
  ...defaultPropNames.map(setName)
];

export const events = [
  'play',
  'pause',
  'ended',
  'loadstart',
  'progress',
  'timeupdate',
  'seeking',
  'seeked',
  'cuechange',
  'volumechange',
  'ratechange',
  'durationchange',
  'error',
];

export function playerx(createPlayer, element, options = {}) {
  const api = {};
  const promises = {};
  const tick = publicPromise();
  let ready = publicPromise();
  let player;
  let ignoreAttributeChange;

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
      if (ignoreAttributeChange) {
        return;
      }

      if (oldValue != newValue) {
        if (attrName === 'src' && (!player || !player.f.canPlay(newValue))) {
          if (newValue) loadPlayer();
        } else {
          await ready;
          callPlayer(attrName, newValue);
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

    async getPlaying() {
      await tick;
      return toPropDefaultTo(element, defaultProps, 'playing');
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
    attachEvents();
    ready._resolve();
  }

  function attachEvents() {
    events.forEach(event => player.on(event, handleEvent.bind(null, event)));

    player.on('play', () => ensureProp('playing', true));
    player.on('pause', () => ensureProp('playing', false));
  }

  function handleEvent(name, detail) {
    const event = new CustomEvent(name, { detail });
    element.dispatchEvent(event);
  }

  async function callPlayer(attrName, value) {
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
        setProp(propName, value);
        return promises[propName];
      };

      Object.defineProperty(methods, propName, {
        configurable: true,
        enumerable: true,
        set: (value) => setProp(propName, value)
      });
    });

    coreMethodNames.forEach(name => {
      methods[name] = async function(...args) {
        await ready;
        return player[name](...args);
      };
    });

    return methods;
  }

  function setProp(propName, value) {
    if (value == null || value === false) {
      element.removeAttribute(kebabCase(propName));
    } else {
      if (isBooleanProp(defaultProps, propName)) value = '';
      element.setAttribute(kebabCase(propName), '' + value);
    }
  }

  function ensureProp(propName, value) {
    ignoreAttributeChange = true;
    setProp(propName, value);
    ignoreAttributeChange = false;
  }

  return completeAssign(api, createMethods(), internalMethods);
}

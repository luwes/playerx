import { defaultProps, defaultPropNames } from './defaults.js';
import { getName, setName } from './helpers/index.js';
import { assign, publicPromise, getAttrsAsProps } from './utils/index.js';

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
  'getPlaybackRate',
  'setPlaybackRate',
  'getVideoWidth',
  'getVideoHeight',
];

export function playerx(createPlayer, element, options = {}) {
  const api = {};
  const promises = {};
  let player;
  let ready = publicPromise();

  const internalMethods = {

    async _connected() {
    },

    async _disconnected() {
    },

    async _attributeChanged(name, oldValue, newValue) {
      if (oldValue != newValue) {
        if (name === 'src' && (!player || !player.f.canPlay(newValue))) {
          loadPlayer();
        } else {
          await ready;
          setProp(name, newValue);
        }
      }
    },

    async getSrc() {
      return element.getAttribute('src');
    },

  };

  function loadPlayer() {
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

    ready._resolve(player.ready());
  }

  async function setProp(name, value) {
    const promise = promises[name];
    if (promise) {
      delete promises[name];
      const result = await player.set(name, value);
      promise._resolve(result);
    } else {
      player.set(name, value);
    }
  }

  function createMethods() {
    const methods = {};

    defaultPropNames.forEach(name => {
      methods[getName(name)] = async function() {
        await ready;
        return player.get(name);
      };

      methods[setName(name)] = async function(value) {
        promises[name] = publicPromise();
        if (value == null) element.removeAttribute(name);
        else element.setAttribute(name, '' + value);
        return promises[name];
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

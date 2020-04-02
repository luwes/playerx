import { base } from './base.js';
import * as Events from './constants/events.js';
import { extend } from './utils/object.js';
import { publicPromise } from './utils/promise.js';

export const coreMethodNames = [
  'set',
  'get',
  'on',
  'off',
  'ready',
  'play',
  'pause',
  'stop',
];

const events = Object.values(Events);

export function playerx(createPlayer, element) {
  let player;
  let ready = publicPromise();

  function init() {
    coreMethodNames.forEach(name => {
      methods[name] = async function(...args) {
        await ready;
        return player[name](...args);
      };
    });
  }

  const methods = {
    fire,

    _connected() {
      // body...
    },

    _disconnected() {
      player.remove();
    },

    _getProp(name) {
      if (player && player.get) {
        const value = player.get(name);
        if (value !== undefined) return value;
      }
      return element.props[name];
    },

    async _update(changedProps) {
      if (!element.src) return;

      const src = 'src' in changedProps && element.src;
      if (src && (!player || !player.f.canPlay(src))) {
        if (src) loadPlayer();
      } else {
        await ready;
        Object.keys(changedProps).forEach(callPlayer);
      }
    },
  };

  function callPlayer(name) {
    const value = element.props[name];
    player.set(name, value);
  }

  async function loadPlayer() {
    let oldPlayer = player;
    if (oldPlayer) {
      ready = publicPromise();
    }

    player = {};
    player = extend(player, base(player), createPlayer(element, loadPlayer));
    player.f = player.f || createPlayer;

    if (oldPlayer) {
      element.replaceChild(player.element, oldPlayer.element);
      oldPlayer.remove();
    } else {
      element.append(player.element);
    }

    await player.ready();
    attachEvents();
    ready.resolve();
  }

  function attachEvents() {
    player.on(Events.PLAY, () => element.refresh('playing', true));
    player.on(Events.PLAYING, () => element.refresh('playing', true));
    player.on(Events.PAUSE, () => element.refresh('playing', false));
    player.on(Events.ENDED, () => element.refresh('playing', false));

    events.forEach(event => player.on(event, fire.bind(null, event)));
  }

  function fire(name, detail = {}) {
    const event = new CustomEvent(name, { detail });
    element.dispatchEvent(event);

    if (!['timeupdate'].includes(name)) {
      console.warn(event);
    }
  }

  init();

  return methods;
}

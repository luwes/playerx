import { base } from './player-base.js';
import * as Events from './constants/events.js';
import { extend } from './utils/object.js';
import { publicPromise } from './utils/promise.js';

const coreMethodNames = [
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
  let ready;

  let currentTimeTimeout;
  let durationTimeout;
  let progressTimeout;
  let volumeTimeout;

  let { volume, muted, currentTime, duration } = element._propsDefaulted;
  let progress;


  function _disconnected() {
    console.log('DISCONNECTED');
    destroy(player);
  }

  function destroy(oldPlayer) {
    clearAllTimeouts();
    oldPlayer.remove();
  }

  function clearAllTimeouts() {
    clearTimeout(currentTimeTimeout);
    clearTimeout(durationTimeout);
    clearTimeout(volumeTimeout);
    clearTimeout(progressTimeout);
  }

  function _getProp(name) {
    if (player && player.get) {
      const value = player.get(name);
      if (value !== undefined && !(value instanceof Promise)) {
        return value;
      }
    }
    return element.props[name];
  }

  async function _update(changedProps) {
    if (!element.src) return;

    const src = 'src' in changedProps && element.src;
    if (src) {
      element.load();
    } else {
      await ready;

      // Here to use `element.load()` in players. Preventing an endless loop.
      // When a player calls this it is meant to re-init the player.
      const prevLoad = element.load;
      element.load = init;
      Object.keys(changedProps).forEach(playerSet);
      element.load = prevLoad;
    }
  }

  function playerSet(name) {
    const value = element.props[name];
    return player.set(name, value);
  }

  async function load() {
    ready = publicPromise();
    const props = element._propsDefaulted;

    if (player && player.f.canPlay(element.src)) {
      clearAllTimeouts();

      // Here to use `element.load()` in players. Preventing an endless loop.
      // When a player calls this it is meant to re-init the player.
      const prevLoad = element.load;
      element.load = init;
      await playerSet('src');
      element.load = prevLoad;

      await afterLoad(props);
      element.fire(Events.LOADSRC);
      return;
    }

    init();
    await afterLoad(props, true);
    element.fire(Events.LOADSRC);
    element.fire(Events.READY);
  }

  function init() {
    let nextSibling;
    let oldPlayer = player;
    if (oldPlayer) {
      nextSibling = oldPlayer.element.nextSibling;
      destroy(oldPlayer);
    }

    player = {};
    player = extend(player, base(element, player), createPlayer(element));
    player.f = player.f || createPlayer;

    if (oldPlayer) {
      element.insertBefore(player.element, nextSibling);
    } else {
      element.append(player.element);
    }
  }

  async function afterLoad({ volume, muted, loop }, init) {
    await player.ready();

    player.set('volume', volume);
    player.set('muted', muted);
    player.set('loop', loop);

    if (init) attachEvents();

    ready.resolve();
    await Promise.all([
      updateCurrentTime(),
      updateDuration(),
      updateVolume(),
      updateProgress(),
    ]);
  }

  function attachEvents() {
    player.on(Events.PAUSE, () => element.refresh('playing', false));
    player.on(Events.PLAY, () => element.refresh('playing', true));
    player.on(Events.PLAYING, () => {
      element.refresh('playing', true);
      updateDuration();
    });

    player.on(Events.ENDED, () => {
      if (element.loop) {
        player.play();
        return;
      }
      element.refresh('playing', false);
      element.fire(Events.ENDED);
    });

    // When the API supports these events the timeouts are disabled.
    player.on(Events.TIMEUPDATE, () => updateCurrentTime(true));
    player.on(Events.DURATIONCHANGE, () => updateDuration(true));
    player.on(Events.VOLUMECHANGE, () => updateVolume(true));
    player.on(Events.PROGRESS, () => updateProgress(true));

    events
      .filter(event => ![
        Events.READY,
        Events.LOADSRC,
        Events.ENDED,
        Events.TIMEUPDATE,
        Events.DURATIONCHANGE,
        Events.VOLUMECHANGE,
        Events.PROGRESS,
      ].includes(event))
      .forEach(event => player.on(event, fire.bind(null, event)));
  }

  async function updateCurrentTime(disableTimeout) {
    clearTimeout(currentTimeTimeout);
    if (!disableTimeout) {
      // When the earliest possible position changes, then: if the current
      // playback position is before the earliest possible position, the user
      // agent must seek to the earliest possible position; otherwise, if the
      // user agent has not fired a timeupdate event at the element in the past
      // 15 to 250ms and is not still running event handlers for such an event,
      // then the user agent must queue a task to fire an event named timeupdate
      // at the element.
      currentTimeTimeout = setTimeout(updateCurrentTime, 250);
    }

    // Sometimes loading a new src the 3rd-party api is not ready yet, wait here.
    await ready;

    let old = currentTime;
    currentTime = await player.get('currentTime');
    if (currentTime !== old) {
      element.refresh('currentTime', currentTime);
      element.fire('timeupdate');
    }
  }

  async function updateDuration(disableTimeout) {
    clearTimeout(durationTimeout);
    if (!disableTimeout) {
      durationTimeout = setTimeout(updateDuration, 250);
    }

    // Sometimes loading a new src the 3rd-party api is not ready yet, wait here.
    await ready;

    let old = duration;
    duration = await player.get('duration');
    if (duration !== old && duration > 0) {
      element.refresh('duration', duration);
      element.fire('durationchange');
    }
  }

  async function updateVolume(disableTimeout) {
    clearTimeout(volumeTimeout);
    if (!disableTimeout) {
      volumeTimeout = setTimeout(updateVolume, 250);
    }

    // Sometimes loading a new src the 3rd-party api is not ready yet, wait here.
    await ready;

    let oldVolume = volume;
    let oldMuted = muted;
    [volume, muted] = await Promise.all([
      player.get('volume'),
      player.get('muted'),
    ]);

    if (volume !== oldVolume || muted !== oldMuted) {
      element.refresh('volume', volume);
      element.refresh('muted', muted);
      element.fire('volumechange');
    }
  }

  async function updateProgress(disableTimeout) {
    clearTimeout(progressTimeout);
    if (!disableTimeout) {
      // https://html.spec.whatwg.org/multipage/media.html#mediaevents
      // While the load is not suspended (see below), every 350ms (±200ms) or for
      // every byte received, whichever is least frequent, queue a task to fire
      // an event named progress at the element.
      progressTimeout = setTimeout(updateProgress, 350);
    }

    // Sometimes loading a new src the 3rd-party api is not ready yet, wait here.
    await ready;

    let old = progress;
    let buffered = await player.get('buffered');
    if (buffered && buffered.length) {
      progress = buffered.end(buffered.length - 1);
      if (progress !== old) {
        element.refresh('buffered', buffered);
        element.fire('progress');
      }
    }
  }

  function fire(name, detail = {}) {
    const event = new CustomEvent(name, { detail });
    element.dispatchEvent(event);

    // if (!['timeupdate'].includes(name)) {
      console.warn(event);
    // }
  }

  const methods = {
    fire,
    load,
    _disconnected,
    _getProp,
    _update,
  };

  coreMethodNames.forEach(name => {
    methods[name] = async function(...args) {
      await ready;
      return player[name](...args);
    };
  });

  return methods;
}

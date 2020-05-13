import { base } from './player-base.js';
import * as Events from './constants/events.js';
import { extend } from './utils/object.js';
import { publicPromise } from './utils/promise.js';

const coreMethodNames = [
  'on',
  'off',
  'ready',
  'play',
  'pause',
  'stop',
  'get',
];

const events = Object.values(Events);
let listeners = {};

export const playerx = (CE, { create }) => (element) => {
  console.dir(element);

  let player;
  let ready;

  let currentTimeTimeout;
  let durationTimeout;
  let progressTimeout;
  let volumeTimeout;

  let { volume, muted, currentTime, duration } = element;
  let progress;
  let hasDurationEvent;

  // Store original getProp because it's overridden.
  // This method is used to get data directly from the property cache.
  element.cache = element.getProp;

  function getProp(name) {
    if (player && player.get) {
      const value = player.get(name);
      if (value !== undefined && !(value instanceof Promise)) {
        return value;
      }
    }
    return element.cache(name);
  }

  function connected() {
    // empty
  }

  function disconnected() {
    destroy(player);
  }

  function destroy(oldPlayer) {
    clearAllTimeouts();
    detachEvents();
    oldPlayer.remove();
  }

  function clearAllTimeouts() {
    clearTimeout(currentTimeTimeout);
    clearTimeout(durationTimeout);
    clearTimeout(volumeTimeout);
    clearTimeout(progressTimeout);
  }

  async function update(changedProps) {
    if (!element.src) return;

    const src = 'src' in changedProps && element.src;
    if (src) {
      element.load();
    } else {
      await ready;
      Object.keys(changedProps).forEach(playerSet);
    }
  }

  function playerSet(name) {
    const value = element.cache(name);
    return player.set(name, value);
  }

  async function load() {
    clearAllTimeouts();
    ready = publicPromise();

    element.fire(Events.LOADSRC);

    if (player && player.f.canPlay(element.src)) {
      const prevLoad = element.load;

      // If `element.load` is called in the player, re-attach events.
      let initEvents = false;
      element.load = () => (initEvents = true) && init();

      // Here to use `element.load()` in players. Preventing an endless loop.
      // When a player calls this it is meant to re-init the player.
      await playerSet('src');
      element.load = prevLoad;

      await afterLoad(initEvents);
      element.fire(Events.LOADEDSRC);

      return;
    }

    init();
    await afterLoad(true);
    element.fire(Events.LOADEDSRC);
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
    player = extend(player, base(element, player), create(element));
    player.f = player.f || create;

    if (oldPlayer) {
      element.insertBefore(player.element, nextSibling);
    } else {
      element.append(player.element);
    }
  }

  async function afterLoad(initEvents) {
    await player.ready();

    player.set('volume', element.cache('volume'));
    player.set('muted', element.cache('muted'));
    player.set('loop', element.cache('loop'));

    if (initEvents) attachEvents();

    // autoplay = autoplay || playing;
    // if (autoplay) player.play();

    ready.resolve();
    await Promise.all([
      updateCurrentTime(),
      updateDuration(),
      updateVolume(),
      updateProgress(),
    ]);
  }

  function attachEvents() {
    listeners = [
      [Events.PAUSE, () => {
        element.setProp('playing', false);
        element.setProp('paused', true);
      }],
      [Events.PLAY, () => {
        element.setProp('paused', false);
        element.setProp('playing', true);
      }],
      [Events.PLAYING, () => {
        element.setProp('paused', false);
        element.setProp('playing', true);
        updateDuration();
      }],
      [Events.ENDED, () => {
        if (element.loop) {
          player.play();
          return;
        }
        element.setProp('playing', false);
        element.setProp('paused', true);
        element.fire(Events.ENDED);
      }],
      // When the API supports these events the timeouts are disabled.
      [Events.TIMEUPDATE, () => updateCurrentTime(true)],
      [Events.VOLUMECHANGE, () => updateVolume(true)],
      [Events.PROGRESS, () => updateProgress(true)],
      [Events.DURATIONCHANGE, () => {
        hasDurationEvent = true;
        updateDuration(true);
      }]
    ];

    events.filter(event => ![
      Events.READY,
      Events.LOADSRC,
      Events.LOADEDSRC,
      Events.ENDED,
      Events.TIMEUPDATE,
      Events.DURATIONCHANGE,
      Events.VOLUMECHANGE,
      Events.PROGRESS,
    ].includes(event))
    .forEach(event => listeners.push([event, fire.bind(null, event)]));

    listeners.forEach(([event, listener]) => player.on(event, listener));
  }

  function detachEvents() {
    listeners.forEach(([event, listener]) => player.off(event, listener));
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
    currentTime = await element.get('currentTime');
    if (currentTime !== old) {
      element.setProp('currentTime', currentTime);
      element.fire('timeupdate');
    }
  }

  async function updateDuration(disableTimeout) {
    clearTimeout(durationTimeout);
    if (!disableTimeout && !hasDurationEvent) {
      durationTimeout = setTimeout(updateDuration, 250);
    }

    // Sometimes loading a new src the 3rd-party api is not ready yet, wait here.
    await ready;

    let old = duration;
    duration = await element.get('duration');
    if (duration !== old && duration > 0) {
      element.setProp('duration', duration);
      element.fire('durationchange');
    }

    if (!element.videoWidth) {
      element.setProp('videoWidth', await element.get('videoWidth'));
    }

    if (!element.videoHeight) {
      element.setProp('videoHeight', await element.get('videoHeight'));
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
      element.get('volume'),
      element.get('muted'),
    ]);

    if (volume !== oldVolume || muted !== oldMuted) {
      element.setProp('volume', volume);
      element.setProp('muted', muted);
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
    let buffered = await element.get('buffered');
    if (buffered && buffered.length) {
      progress = buffered.end(buffered.length - 1);
      if (progress !== old) {
        element.setProp('buffered', buffered);
        element.fire('progress');
      }
    }
  }

  function fire(name, detail = {}) {
    const event = new CustomEvent(name, { detail });
    element.dispatchEvent(event);
  }

  const methods = {
    fire,
    load,
    connected,
    disconnected,
    update,
    getProp,
  };

  coreMethodNames.forEach(name => {
    methods[name] = async function(...args) {
      await ready;
      return player[name](...args);
    };
  });

  return methods;
};

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

  let currentTimeTimeout;
  let durationTimeout;
  let progressTimeout;
  let volumeTimeout;

  let currentTime = 0;
  let duration;
  let muted = false;
  let progress;
  let volume = 1;

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

    _disconnected() {
      destroy(player);
    },

    _getProp(name) {
      if (player && player.get) {
        const value = player.get(name);
        if (value !== undefined && !(value instanceof Promise)) {
          return value;
        }
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

  function destroy(oldPlayer) {
    clearTimeout(currentTimeTimeout);
    clearTimeout(durationTimeout);
    clearTimeout(volumeTimeout);
    clearTimeout(progressTimeout);

    oldPlayer.remove();
  }

  function callPlayer(name) {
    const value = element.props[name];
    player.set(name, value);
  }

  async function loadPlayer() {
    let nextElement;
    let oldPlayer = player;
    if (oldPlayer) {
      nextElement = oldPlayer.element.nextSibling;
      destroy(oldPlayer);
      ready = publicPromise();
    }

    player = {};
    player = extend(player, base(element, player), createPlayer(element, loadPlayer));
    player.f = player.f || createPlayer;

    if (oldPlayer) {
      element.insertBefore(player.element, nextElement);
    } else {
      element.append(player.element);
    }

    await player.ready();

    player.set('volume', element._getPropDefaulted('volume'));
    player.set('muted', element._getPropDefaulted('muted'));
    player.set('loop', element._getPropDefaulted('loop'));

    attachEvents();
    updateCurrentTime();
    updateDuration();
    updateVolume();
    updateProgress();

    ready.resolve();
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

    // Sometimes loading a new src the 3rd-party api is not ready yet, wait here.
    await player.ready();

    let old = currentTime;
    currentTime = await player.get('currentTime');
    if (currentTime !== old) {
      element.refresh('currentTime', currentTime);
      element.fire('timeupdate');
    }

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
  }

  async function updateDuration(disableTimeout) {
    clearTimeout(durationTimeout);

    // Sometimes loading a new src the 3rd-party api is not ready yet, wait here.
    await player.ready();

    let old = duration;
    duration = await player.get('duration');
    if (duration !== old && duration > 0) {
      element.refresh('duration', duration);
      element.fire('durationchange');
    }

    if (!disableTimeout) {
      durationTimeout = setTimeout(updateDuration, 250);
    }
  }

  async function updateVolume(disableTimeout) {
    clearTimeout(volumeTimeout);

    // Sometimes loading a new src the 3rd-party api is not ready yet, wait here.
    await player.ready();

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

    if (!disableTimeout) {
      volumeTimeout = setTimeout(updateVolume, 250);
    }
  }

  async function updateProgress(disableTimeout) {
    clearTimeout(progressTimeout);

    // Sometimes loading a new src the 3rd-party api is not ready yet, wait here.
    await player.ready();

    let old = progress;
    let buffered = await player.get('buffered');
    if (buffered && buffered.length) {
      progress = buffered.end(buffered.length - 1);
      if (progress !== old) {
        element.refresh('buffered', buffered);
        element.fire('progress');
      }
    }

    if (!disableTimeout) {
      // https://html.spec.whatwg.org/multipage/media.html#mediaevents
      // While the load is not suspended (see below), every 350ms (±200ms) or for
      // every byte received, whichever is least frequent, queue a task to fire
      // an event named progress at the element.
      progressTimeout = setTimeout(updateProgress, 350);
    }
  }

  function fire(name, detail = {}) {
    const event = new CustomEvent(name, { detail });
    element.dispatchEvent(event);

    // if (!['timeupdate'].includes(name)) {
      console.warn(event);
    // }
  }

  init();

  return methods;
}

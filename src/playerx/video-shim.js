import * as Events from './constants/events.js';
import { objectValues, publicPromise } from './utils.js';

const events = objectValues(Events);

export function createVideoShim(element) {
  let listeners = [];
  let apiReady;
  let currentTimeTimeout;
  let durationTimeout;
  let progressTimeout;
  let volumeTimeout;
  let resizeTimeout;
  let progress;
  let videoWidth;
  let videoHeight;
  let hasDurationEvent;
  let playFired;
  let { volume, muted, currentTime, duration } = element;

  function unload() {
    clearAllTimeouts();
    apiReady = publicPromise();
    element.setCache('readyState', 0); // HTMLMediaElement.HAVE_NOTHING
  }

  function clearAllTimeouts() {
    clearTimeout(currentTimeTimeout);
    clearTimeout(durationTimeout);
    clearTimeout(volumeTimeout);
    clearTimeout(progressTimeout);
    clearTimeout(resizeTimeout);
  }

  function updateProps() {
    apiReady.resolve();

    return Promise.all([
      updateCurrentTime(),
      updateDuration(),
      updateVolume(),
      updateProgress(),
      updateResize(),
    ]);
  }

  function ready() {
    return apiReady;
  }

  function attachEvents(player) {
    listeners = [
      [
        Events.LOADEDMETADATA,
        () => element.setCache('readyState', 1) // HTMLMediaElement.HAVE_METADATA
      ],
      [
        Events.PAUSE,
        () => {
          element.setCache('playing', false);
          element.setCache('paused', true);
        },
      ],
      [
        Events.PLAY,
        () => {
          element.setCache('paused', false);
          element.setCache('playing', true);
          playFired = true;
        },
      ],
      [
        Events.PLAYING,
        () => {
          element.setCache('paused', false);
          element.setCache('playing', true);
          element.setCache('readyState', 3); // HTMLMediaElement.HAVE_FUTURE_DATA
          updateDuration();
          playFired = false;
        },
      ],
      [
        Events.SEEKING,
        () => element.setCache('seeking', true)
      ],
      [
        Events.SEEKED,
        () => {
          element.setCache('seeking', false);
          element.setCache('readyState', 1); // HTMLMediaElement.HAVE_METADATA
        }
      ],
      [
        Events.ENDED,
        () => {
          if (element.loop) {
            element.play();
            return;
          }
          element.setCache('playing', false);
          element.setCache('paused', true);
          element.fire(Events.ENDED);
        },
      ],
      // When the API supports these events the timeouts are disabled.
      [Events.TIMEUPDATE, () => updateCurrentTime(true)],
      [Events.VOLUMECHANGE, () => updateVolume(true)],
      [Events.PROGRESS, () => updateProgress(true)],
      [Events.RESIZE, () => updateResize(true)],
      [
        Events.DURATIONCHANGE,
        () => {
          hasDurationEvent = true;
          updateDuration(true);
        },
      ],
    ];

    events
      .filter(
        (event) =>
          [
            Events.READY,
            Events.LOADSRC,
            Events.LOADEDSRC,
            Events.ENDED,
            Events.TIMEUPDATE,
            Events.DURATIONCHANGE,
            Events.VOLUMECHANGE,
            Events.PROGRESS,
            Events.RESIZE,
          ].indexOf(event) === -1
      )
      .forEach((event) =>
        listeners.push([event, element.fire.bind(element, event)])
      );

    listeners.forEach(([event, listener]) => player.on(event, listener));
  }

  function detachEvents(player) {
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
    await apiReady;

    if (playFired) {
      playFired = false;
      element.fire('playing');
      element.setCache('readyState', 3); // HTMLMediaElement.HAVE_FUTURE_DATA
    }

    let old = currentTime;
    currentTime = await element.get('currentTime');
    if (currentTime !== old) {
      element.setCache('currentTime', currentTime);
      element.fire('timeupdate');
    }
  }

  async function updateDuration(disableTimeout) {
    clearTimeout(durationTimeout);
    if (!disableTimeout && !hasDurationEvent) {
      durationTimeout = setTimeout(updateDuration, 250);
    }

    // Sometimes loading a new src the 3rd-party api is not ready yet, wait here.
    await apiReady;

    let old = duration;
    duration = await element.get('duration');
    if (duration !== old && duration > 0) {
      element.setCache('duration', duration);
      element.fire('durationchange');
    }
  }

  async function updateVolume(disableTimeout) {
    clearTimeout(volumeTimeout);
    if (!disableTimeout) {
      volumeTimeout = setTimeout(updateVolume, 250);
    }

    // Sometimes loading a new src the 3rd-party api is not ready yet, wait here.
    await apiReady;

    let oldVolume = volume;
    let oldMuted = muted;
    [volume, muted] = await Promise.all([
      element.get('volume'),
      element.get('muted'),
    ]);

    if (volume !== oldVolume || muted !== oldMuted) {
      element.setCache('volume', volume);
      element.setCache('muted', muted);
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
    await apiReady;

    let old = progress;
    let buffered = await element.get('buffered');
    if (buffered) {
      element.setCache('buffered', buffered);

      if (buffered.length) {
        progress = buffered.end(buffered.length - 1);
        if (progress !== old) {
          element.fire('progress');
        }

        let percent = Math.round(progress / duration);
        if (percent === 1) {
          element.setCache('readyState', 4); // HTMLMediaElement.HAVE_ENOUGH_DATA
        }
      }
    }
  }

  async function updateResize(disableTimeout) {
    clearTimeout(resizeTimeout);
    if (!disableTimeout) {
      resizeTimeout = setTimeout(updateResize, 250);
    }

    // Sometimes loading a new src the 3rd-party api is not ready yet, wait here.
    await apiReady;

    let resized;

    let oldWidth = videoWidth;
    videoWidth = await element.get('videoWidth');
    if (videoWidth !== oldWidth && videoWidth > 0) {
      resized = true;
      element.setCache('videoWidth', videoWidth);
    }

    let oldHeight = videoHeight;
    videoHeight = await element.get('videoHeight');
    if (videoHeight !== oldHeight && videoHeight > 0) {
      resized = true;
      element.setCache('videoHeight', videoHeight);
    }

    if (resized) {
      element.fire('resize');
    }
  }

  return {
    unload,
    updateProps,
    ready,
    attachEvents,
    detachEvents,
  };
}

import { getName, setName } from './helpers.js';
import { createTimeRanges, isMethod, getProperty, getMethod, getPropertyDescriptor, delay } from './utils.js';

export function base(element, player) {
  return {

    /**
     * Set a player property, try player interface first, then internal api.
     * @param  {string} name
     * @param {*} value
     * @return {*}
     */
    set(name, value) {
      if (name == null) return;

      let descriptor = getPropertyDescriptor(player, name);
      if (descriptor && descriptor.set) return (player[name] = value);

      const method = setName(name);
      if (isMethod(player, method)) return player[method](value);

      if (!player.api) return;

      descriptor = getPropertyDescriptor(player.api, name);
      if (descriptor && descriptor.set) return (player.api[name] = value);

      if (isMethod(player.api, name)) return player.api[name](value);
      if (isMethod(player.api, method)) return player.api[method](value);
    },

    /**
     * Get a player property, try player interface first, then internal api.
     * @param  {string} name
     * @return {*}
     */
    get(name) {
      if (name == null) return;

      let result;
      const method = getName(name);
      if ((result = getProperty(player, name)) !== undefined) return result;
      if ((result = getMethod(player, method)) !== undefined) return result;

      if (!player.api) return;

      if ((result = getProperty(player.api, name)) !== undefined) return result;
      if ((result = getMethod(player.api, name)) !== undefined) return result;
      if ((result = getMethod(player.api, method)) !== undefined) return result;
    },

    unsupported: {},
    supports(method) {
      return !(method in player.unsupported);
    },

    remove() {
      return player.api && player.api.remove();
    },

    play() {
      return player.api && player.api.play();
    },

    pause() {
      return player.api && player.api.pause();
    },

    async stop() {
      await player.pause();
      await delay(130); // add small delay for async call completion
      await player.set('currentTime', 0);
      await delay(130); // add small delay for async call completion
    },

    on(eventName, callback) {
      player.api.on(eventName, callback);
    },

    off(eventName, callback) {
      player.api.off(eventName, callback);
    },

    setPlaying(playing) {
      if (!element.paused && !playing) {
        return player.pause();
      }
      if (element.paused && playing) {
        return player.play();
      }
    },

    getEnded() {
      return element.currentTime > 0 && element.currentTime == element.duration;
    },

    getKey() {
      return player.name && player.name.toLowerCase();
    },

    getBuffered() {
      return createTimeRanges();
    },
  };
}

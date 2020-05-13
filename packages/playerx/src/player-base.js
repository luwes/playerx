import { getName, setName } from './helpers/string.js';
import { isMethod, getProperty, getMethod } from './utils/utils.js';
import { getPropertyDescriptor } from './utils/object.js';

export function base(element, player) {
  return {

    /**
     * Set a player property, try player interface first, then internal api.
     * @param  {string} name
     * @param {*} value
     * @return {*}
     */
    set(name, value) {
      if (!player.api) return;

      let descriptor = getPropertyDescriptor(player, name);
      if (descriptor && descriptor.set) return (player[name] = value);

      const method = setName(name);
      if (isMethod(player, method)) return player[method](value);

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
      if (!player.api) return;

      let result;
      const method = getName(name);
      if ((result = getProperty(player, name)) !== undefined) return result;
      if ((result = getMethod(player, method)) !== undefined) return result;

      if ((result = getProperty(player.api, name)) !== undefined) return result;
      if ((result = getMethod(player.api, name)) !== undefined) return result;
      if ((result = getMethod(player.api, method)) !== undefined) return result;
    },

    remove() {
      return player.api.remove();
    },

    play() {
      return player.api.play();
    },

    pause() {
      return player.api.pause();
    },

    on(eventName, callback) {
      player.api.on(eventName, callback);
    },

    off(eventName, callback) {
      player.api.off(eventName, callback);
    },

    set playing(playing) {
      return playing ? player.play() : player.pause();
    },

    get ended() {
      return element.currentTime == element.duration;
    },
  };
}

import { getName, setName } from './helpers/string.js';
import { isMethod } from './utils/utils.js';

export function base(element, player) {
  return {

    set(name, value) {
      let descriptor = Object.getOwnPropertyDescriptor(player, name);
      if (descriptor && descriptor.set) return (player[name] = value);

      const method = setName(name);
      if (isMethod(player, method)) return player[method](value);
      if (isMethod(player.api, name)) return player.api[name](value);
      if (isMethod(player.api, method)) return player.api[method](value);
    },

    get(name) {
      let descriptor = Object.getOwnPropertyDescriptor(player, name);
      if (descriptor && descriptor.get) return player[name];

      if (player.api && name in player.api && !isMethod(player.api, name)) {
        return player.api[name];
      }

      const method = getName(name);
      if (isMethod(player, method)) return player[method]();
      if (isMethod(player.api, name)) return player.api[name]();
      if (isMethod(player.api, method)) return player.api[method]();
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

    set playing(playing) {
      return playing ? player.play() : player.pause();
    },

    get ended() {
      return element.currentTime == element.duration;
    },
  };
}

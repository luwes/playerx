import { getName, setName } from './helpers/string.js';

export function base(player) {
  return {

    set(name, value) {
      let descriptor = Object.getOwnPropertyDescriptor(player, name);
      if (descriptor && descriptor.set) return (player[name] = value);

      const method = setName(name);
      if (player[method]) return player[method](value);
      if (player.api[method]) return player.api[method](value);
    },

    get(name) {
      let descriptor = Object.getOwnPropertyDescriptor(player, name);
      if (descriptor && descriptor.get) return player[name];

      const method = getName(name);
      if (player[method]) return player[method]();
      if (player.api[method]) return player.api[method]();
    },

    play() {
      return player.api.play();
    },

    pause() {
      return player.api.pause();
    },

    setPlaying(playing) {
      return playing ? player.play() : player.pause();
    },

  };
}

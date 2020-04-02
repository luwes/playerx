import { define } from './define.js';
import * as players from './players/index.js';
import * as Events from './constants/events.js';
export { Events };

function x(element, ...args) {
  for (let key in players) {
    const f = players[key];
    if (f.canPlay(element.src)) {
      const player = f(element, ...args);
      player.f = f;
      return player;
    }
  }
}

export const Playerx = define('player-x', x);

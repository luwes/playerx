import { canPlay } from './can-play.js';
import { define } from './define.js';
import * as players from './players/index.js';
import { file } from './players/file.js';


/** @typedef { import('./index').Playerx } Playerx */

/**
 * Playerx, plays almost everything.
 * @type {Playerx}
 */
export const Playerx = define('player-x', x);

function x(element, ...args) {
  for (let key in canPlay) {

    const createPlayer = players[key];
    if (canPlay[key](element.src)) {

      const player = createPlayer(element, ...args);
      player.constructor = createPlayer;
      return player;
    }
  }

  const player = file(element, ...args);
  player.constructor = file;
  return player;
}

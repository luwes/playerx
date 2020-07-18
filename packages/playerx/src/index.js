/**
 * Copyright (c) 2020, Wesley Luyten, @luwes
 * @see LICENSE
 */
import { canPlay } from './can-play.js';
import { define } from './define.js';
import * as players from './players/index.js';
import { file } from './players/file.js';
import * as Events from './constants/events.js';
import { version } from './constants/version.js';
import * as VideoEvents from './constants/video-events.js';
import { options } from './options.js';

export * from 'swiss';
export { addCssRule, getStyle } from './utils/css.js';
export { loadScript } from './utils/load-script.js';
export {
  Events,
  VideoEvents,
  options,
  version
};

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

/** @typedef { import('./index').Playerx } Playerx */

/**
 * Playerx, plays almost everything.
 * @type {Playerx}
 */
export const Playerx = define('player-x', x);

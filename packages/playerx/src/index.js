/**
 * Copyright (c) 2020, Wesley Luyten, @luwes
 * @see LICENSE
 */
import { define } from './define.js';
import * as players from './players/index.js';
import { file } from './players/file.js';
import * as Events from './constants/events.js';
import { version } from './constants/version.js';
import * as VideoEvents from './constants/video-events.js';
import { options } from './options.js';

function x(element, ...args) {
  for (let key in players) {
    const f = players[key];
    if (f.canPlay(element.src)) {
      const player = f(element, ...args);
      player.f = f;
      return player;
    }
  }

  const player = file(element, ...args);
  player.f = file;
  return player;
}

export const Playerx = define('player-x', x);

export {
  Events,
  VideoEvents,
  options,
  version
};

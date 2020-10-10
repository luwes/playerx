import { define } from './define.js';
import { options } from './options.js';

/** @typedef { import('./index').Playerx } Playerx */

/**
 * Playerx, plays almost everything.
 * @type {Playerx}
 */
export const Playerx = define('player-x', x);

async function x(element) {
  for (let key in options.players) {
    const playerConfig = options.players[key];
    if (playerConfig.canPlay(element.src)) {
      return getPlayer(playerConfig, element);
    }
  }

  // Fallback to file player.
  return getPlayer(options.players.file, element);
}

async function getPlayer(playerConfig, element) {
  const createPlayer = playerConfig.lazyPlayer
      ? (await playerConfig.lazyPlayer()).createPlayer
      : playerConfig;

  const player = createPlayer(element);
  player.constructor = createPlayer;
  return player;
}

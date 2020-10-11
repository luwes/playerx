/**
 * Copyright (c) 2020, Wesley Luyten, @luwes
 * @see LICENSE
 */
import { Element } from 'swiss';
import { LoadingMixin } from './loading.js';
import { options } from './options.js';
import { PlayerxMixin, props } from './playerx.js';
import { addCssRule, getStyle, loadScript } from './utils.js';

export * from 'swiss';
export * as Events from './constants/events.js';
export * as VideoEvents from './constants/video-events.js';
export { version } from './constants/version.js';
export { options } from './options.js';

/** @typedef { import('./index').Playerx } Playerx */

/**
 * Playerx, plays almost everything.
 * @type {Playerx}
 */
export const Playerx = define('player-x', findPlayer);

function define(name, create) {
  const CE = Element({
    props,
    create,
  });

  CE.mixins.push(PlayerxMixin);

  // Wait one tick to define the custom element for plugins to be added.
  Promise.resolve().then(() => {
    // Loading mixin should be the last one that overrides `load()`.
    CE.mixins.push(LoadingMixin);

    if (!customElements.get(name)) {
      customElements.define(name, CE);
    }
  });

  return CE;
}

function findPlayer(element) {
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

export const utils = {
  addCssRule,
  getStyle,
  loadScript,
};

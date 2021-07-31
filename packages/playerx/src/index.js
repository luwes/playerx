/**
 * Copyright (c) 2021, Wesley Luyten, @luwes
 * @see LICENSE
 */
import { Element } from './element.js';
import { LoadingMixin } from './loading.js';
import { PlayerxMixin, props, getCurrentPlayerConfig } from './playerx.js';
import { addCssRule, deleteCssRule, getStyle, loadScript } from './utils.js';

export * from './element.js';
export * from './script.js';
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

  const event = new CustomEvent('define', { detail: { CE } });
  window.dispatchEvent(event);

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

async function findPlayer(element, ...args) {
  const playerConfig = getCurrentPlayerConfig(element.src);
  const createPlayer = playerConfig.lazyPlayer
    ? (await playerConfig.lazyPlayer()).createPlayer
    : playerConfig;

  const player = createPlayer(element, ...args);
  player.constructor = createPlayer;
  return player;
}

export const utils = {
  addCssRule,
  deleteCssRule,
  getStyle,
  loadScript,
};

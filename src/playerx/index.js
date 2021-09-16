/**
 * Copyright (c) 2021, Wesley Luyten, @luwes
 * @see LICENSE
 */
import { defineCustomElement } from './element.js';
import { LoadingMixin } from './loading.js';
import { PlayerxElement } from './playerx.js';
import { addCssRule, deleteCssRule, getStyle, loadScript } from './utils.js';

export * from './element.js';
export * from './script.js';
export * as Events from './constants/events.js';
export * as VideoEvents from './constants/video-events.js';
export { version } from './constants/version.js';
export { options } from './options.js';

export const Playerx = LoadingMixin(PlayerxElement);
defineCustomElement('player-x', Playerx);

export const utils = {
  addCssRule,
  deleteCssRule,
  getStyle,
  loadScript,
};

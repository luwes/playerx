import { playerx } from './playerx.js';
import { customElement } from './helpers/custom-element.js';
import * as defaults from './defaults.js';
import { kebabCase } from './utils/string.js';
import { extend } from './utils/object.js';
import { define as def } from './utils/define.js';

export function define(name, create) {
  return def(name, (element, ...args) => {
    return extend(
      customElement(defaults, element, ...args),
      playerx(create, element, ...args)
    );
  }, Object.keys(defaults.defaultProps).map(kebabCase));
}

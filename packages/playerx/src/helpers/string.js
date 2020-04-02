import { startCase } from '../utils/index.js';

export function prefixName(prefix, name) {
  return `${prefix}${startCase(name)}`;
}

export function getName(name) {
  return prefixName('get', name);
}

export function setName(name) {
  return prefixName('set', name);
}

import { camelCase } from './string.js';

export function createElement(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  Object.keys(props).forEach(prop => (el[prop] = props[prop]));
  children.forEach(child => el.append(child));
  return el;
}

export function getAttrsAsProps(element) {
  const attrs = element.attributes;
  const props = {};

  Array.from(attrs).forEach(attr => {
    props[camelCase(attr.name)] = attr.value;
  });

  return props;
}

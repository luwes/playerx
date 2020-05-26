import { createElement } from './dom.js';

let style;
export function getStyle() {
  if (!style) {
    style = document.head.appendChild(createElement('style'));
    style.innerHTML = ' ';
  }
  return style;
}

export function addCssRule(selector, props) {
  const rule = `${selector}{${Object.keys(props)
    .map(prop => `${prop}:${cssNumber(props[prop], prop)};`)
    .join('')}}`;
  const sheet = getStyle().sheet;
  return sheet.cssRules[sheet.insertRule(rule, sheet.cssRules.length)];
}

export function cssNumber(number, property) {
  if (number === 0 ||
    property === 'z-index' ||
    property === 'opacity') {
    return '' + number;
  }
  if (parseInt(number) + '' == number) number += 'px';
  return number;
}

import { createElement } from './dom.js';

let sheet;
export function getStyleSheet() {
  if (!sheet) {
    const style = createElement('style');
    document.head.prepend(style);
    sheet = style.sheet;
  }
  return sheet;
}

export function addCssRule(selector, props) {
  const rule = `${selector}{${Object.keys(props)
    .map(prop => `${prop}:${boxUnit(props[prop])};`)
    .join('')}}`;
  const sheet = getStyleSheet();
  return sheet.cssRules[sheet.insertRule(rule, sheet.cssRules.length)];
}

export function boxUnit(number) {
  if (parseInt(number) + '' == number) number += 'px';
  return number;
}

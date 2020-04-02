import { camelCase } from '../utils/index.js';

export function toPropDefaultTo(element, defaultProps, attrName) {
  const propValue = attrToProp(
    defaultProps,
    attrName,
    element.getAttribute(attrName)
  );
  if (propValue != null) return propValue;
  return defaultProps[camelCase(attrName)];
}

export function attrToProp(defaultProps, attrName, attrValue) {
  const propName = camelCase(attrName);
  const defaultPropValue = defaultProps[propName];
  if (defaultPropValue === false || defaultPropValue === true) {
    return attrValue != null;
  } else if (attrValue != null && typeof defaultPropValue === 'number') {
    return Number(attrValue);
  }
  return attrValue;
}

export function isBooleanProp(defaultProps, propName) {
  // Boolean attributes are considered to be true if they're present on
  // the element at all, regardless of their actual value; as a rule,
  // you should specify the empty string ("") in value.
  return defaultProps[propName] === false || defaultProps[propName] === true;
}


export function createElement(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  Object.keys(props).forEach(prop => (el[prop] = props[prop]));
  children.forEach(child => el.append(child));
  return el;
}

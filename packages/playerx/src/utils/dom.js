
export function createElement(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  Object.keys(attrs).forEach(name => el.setAttribute(name, attrs[name]));
  children.forEach(child => el.append(child));
  return el;
}

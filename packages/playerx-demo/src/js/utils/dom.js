
export function qs(selector) {
  return document.querySelector(selector);
}

export function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

export function cx(classes) {
  return function() {
    const { el } = this;
    Object.keys(classes).forEach((key) => {
      const value = classes[key];
      el.classList.toggle(key, typeof value === 'function' ? value() : value);
    });
    return el.className;
  };
}

export function stopProp(fn) {
  return (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    fn(e);
  };
}

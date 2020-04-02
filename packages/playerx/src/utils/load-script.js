import { createElement } from './dom.js';

export function loadScript(src, globalName, readyFnName) {
  if (self[globalName]) {
    return Promise.resolve(self[globalName]);
  }

  return new Promise(function(resolve, reject) {
    const script = createElement('script', {
      src,
      defer: true,
      async: true,
    });

    script.onload = () => {
      script.remove();

      const ready = () => resolve(self[globalName]);
      if (readyFnName) {
        self[readyFnName] = ready;
      } else {
        ready();
      }
    };

    script.onerror = function(error) {
      script.remove();
      reject(error);
    };

    document.head.append(script);
  });
}

import { getCurrentPlayerConfig } from './playerx.js';
import { createElement } from './utils.js';

export const LoadingMixin = (CE) => {
  CE.defineProp('loading', {
    get: (el, val) => val,
    set: (el, val) => val,
    reflect: true,
  });

  return (element) => {
    let { load } = element;
    let observer;
    let loadCalled;

    element.addEventListener('click', onclick);

    function onclick(e) {
      // If this is a click in the media ignore it.
      const media = element.querySelector('plx-media');
      if (media && media.contains(e.target)) {
        return;
      }

      if (element.loading) {
        if (element.loading === 'user') {
          element.load();
        }
      } else {
        if (element.paused) {
          element.play();
        } else {
          element.pause();
        }
      }
    }

    function newLoad() {
      preconnect();

      if (observer) {
        observer.unobserve(element);
      }

      if (element.loading === 'user') {
        loadCalled = false;
        element.unload();
        element.load = lazyLoad;
        return;
      }

      if (element.loading === 'lazy') {
        element.unload();
        observer = initIntersectionObserver();
        return;
      }

      return load();
    }

    async function lazyLoad() {
      loadCalled = true;
      try {
        element.loading = null;
        await load();
        element.load = newLoad;
      } catch (error) {
        //...
      }
    }

    function preconnect() {
      const playerConfig = getCurrentPlayerConfig(element.src);
      if (playerConfig.preconnect) {
        playerConfig.preconnect.forEach((href) => {
          document.head.appendChild(createElement('link', {
            href,
            rel: 'preconnect',
            crossorigin: '',
          }));
        });
      }
    }

    function initIntersectionObserver() {
      if (
        'IntersectionObserver' in window &&
        'IntersectionObserverEntry' in window
      ) {
        const intersectionObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !loadCalled) {
              intersectionObserver.unobserve(element);
              lazyLoad();
            }
          });
        });

        intersectionObserver.observe(element);
        return intersectionObserver;
      }
    }

    return {
      load: newLoad,
    };
  };
};

import { getCurrentPlayerConfigKey } from './playerx.js';
import { options } from './options.js';
import { reflect } from './element.js';
import { createElement } from './utils.js';

export const LoadingMixin = (CE) => class extends CE {
  static props = {
    ...CE.props,
    ...reflect({
      loading: undefined
    })
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', onclick);
  }

  load() {
    preconnect(this);

    if (this._observer) {
      this._observer.unobserve(this);
    }

    if (this.loading === 'user') {
      this._loadCalled = false;
      this.unload();
      return;
    }

    if (this.loading === 'lazy') {
      this.unload();
      this._observer = initIntersectionObserver(this);
      return;
    }

    return super.load();
  }

  async _lazyLoad() {
    this._loadCalled = true;
    try {
      this.loading = null;
      await super.load();
    } catch (error) {
      //...
    }
  }
};

function onclick(e) {
  const element = e.currentTarget;
  // If this is a click in the media ignore it.
  const media = element.querySelector('plx-media');
  if (media && media.contains(e.target)) {
    return;
  }

  if (element.loading) {
    if (element.loading === 'user') {
      element._lazyLoad();
    }
  } else {
    if (element.paused) {
      element.play();
    } else {
      element.pause();
    }
  }
}

function initIntersectionObserver(element) {
  if (
    'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window
  ) {
    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !element._loadCalled) {
          intersectionObserver.unobserve(element);
          element._lazyLoad();
        }
      });
    });

    intersectionObserver.observe(element);
    return intersectionObserver;
  }
}

function preconnect(element) {
  const playerConfigKey = getCurrentPlayerConfigKey(element.src);
  const playerConfig = options.players[playerConfigKey];
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

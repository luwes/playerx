import { SuperVideoElement } from '../../node_modules/super-media-element/dist/index.js';
import { options } from './options.js';
import { loadScript, populate } from './utils.js';

const templateLightDOM = document.createElement('template');
templateLightDOM.innerHTML = `
<style>
  .plx-media {
    width: 100%;
    height: 100%;
  }
</style>
`;

class Playerx extends SuperVideoElement {
  #hasStyle = false;
  #hasLoaded = false;
  #loadResolve;

  constructor() {
    super();

    // loadComplete is a getter/setter in SuperVideoElement
    this.loadComplete = new Promise((resolve) => {
      this.#loadResolve = resolve;
    });
  }

  async attributeChangedCallback(attrName, oldValue, newValue) {
    // This is required to come before the await for resolving loadComplete.
    if (attrName === 'src' && newValue) {
      this.load();
      return;
    }

    super.attributeChangedCallback(attrName, oldValue, newValue);

    await this.loadComplete;

    switch (attrName) {
      case 'autoplay':
      case 'controls':
      case 'loop':
      case 'muted': {
        if (newValue != null) {
          this.nativeEl.setAttribute(attrName, '');
        } else {
          this.nativeEl.removeAttribute(attrName);
        }
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();

    if (!this.#hasStyle) {
      this.#hasStyle = true;
      this.append(templateLightDOM.content.cloneNode(true));
    }
  }

  async load() {
    // Reset the load complete promise if there has been loading before.
    if (this.#hasLoaded) {
      // loadComplete is a getter/setter in SuperVideoElement
      this.loadComplete = new Promise((resolve) => {
        this.#loadResolve = resolve;
      });
    }
    this.#hasLoaded = true;

    const canLoadSource = canPlayerLoadSource(this);
    if (!canLoadSource) {
      this.nativeEl?.remove();
      this.nativeEl = null;
    }

    // Wait 1 tick to allow other attributes to be set.
    await Promise.resolve();

    this.key = getCurrentPlayerConfigKey(this.src);
    const config = options.players[this.key];
    config.npmCdn = options.npmCdn;

    const jsUrl = populate(config.jsUrl, config);
    if (jsUrl) {
      await loadScript(jsUrl);
    }

    if (!canLoadSource) {
      this.nativeEl = this.appendChild(document.createElement(config.type));
      this.nativeEl.className = 'plx-media';
    }

    this.nativeEl.setAttribute('src', this.getAttribute('src'));
    if (this.autoplay) this.nativeEl.setAttribute('autoplay', '');
    if (this.loop) this.nativeEl.setAttribute('loop', '');
    if (this.controls) this.nativeEl.setAttribute('controls', '');
    if (this.defaultMuted || this.muted) {
      this.nativeEl.setAttribute('muted', '');
    }

    this.#loadResolve();
  }

  get api() {
    return this.nativeEl;
  }

  get autoplay() {
    return this.hasAttribute('autoplay');
  }

  set autoplay(val) {
    if (this.autoplay == val) return;
    if (val) this.setAttribute('autoplay', '');
    else this.removeAttribute('autoplay');
  }

  get defaultMuted() {
    return this.hasAttribute('muted');
  }

  set defaultMuted(val) {
    if (this.defaultMuted == val) return;
    if (val) this.setAttribute('muted', '');
    else this.removeAttribute('muted');
  }

  get loop() {
    return this.hasAttribute('loop');
  }

  set loop(val) {
    if (this.loop == val) return;
    if (val) this.setAttribute('loop', '');
    else this.removeAttribute('loop');
  }

  get src() {
    return this.getAttribute('src');
  }

  set src(val) {
    if (this.src == val) return;
    this.setAttribute('src', val);
  }

  get controls() {
    return this.hasAttribute('controls');
  }

  set controls(val) {
    if (this.controls == val) return;
    if (val) this.setAttribute('controls', '');
    else this.removeAttribute('controls');
  }
}

function canPlayerLoadSource(element) {
  const playerParam = getSrcParam(element.src, 'player');
  if (playerParam && playerParam !== element.key) {
    return false;
  }
  return (
    element.api && options.players[element.key].pattern?.test(element.src)
  );
}

function getCurrentPlayerConfigKey(src) {
  const playerParam = getSrcParam(src, 'player');
  if (options.players[playerParam]) {
    return playerParam;
  }

  for (let key in options.players) {
    const playerConfig = options.players[key];
    if (playerConfig.pattern?.test(src)) {
      return key;
    }
  }
  // Fallback to html player.
  return 'html';
}

function getSrcParam(src, key) {
  const url = Array.isArray(src) ? src[0] : src;
  return url && new URLSearchParams(url.split('?')[1]).get(key);
}

if (!globalThis.customElements.get('player-x')) {
  globalThis.customElements.define('player-x', Playerx);
  globalThis.Playerx = Playerx;
}

export { Playerx };

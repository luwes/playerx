import { SuperVideoElement } from 'super-media-element';
import { options } from './options.js';

const template = document.createElement('template');
template.innerHTML = `
  ${SuperVideoElement.template.innerHTML}
  <style>
    ::slotted([src]) {
      width: 100%;
      height: 100%;
    }
  </style>
`;

class Playerx extends SuperVideoElement {
  static template = template;

  async load() {
    const canLoadSource = canPlayerLoadSource(this);
    if (!canLoadSource) {
      this.nativeEl?.remove();
      this.nativeEl = null;
    }

    if (!this.getAttribute('src')) {
      return;
    }

    this.key = getCurrentPlayerConfigKey(this.src);
    const config = options.players[this.key];
    config.npmCdn = options.npmCdn;

    const jsUrl = config.jsUrl && populate(config.jsUrl, config);
    if (jsUrl) {
      await loadScript(jsUrl);
    }

    if (!canLoadSource) {
      this.nativeEl = this.appendChild(document.createElement(config.type));
    }

    this.nativeEl.toggleAttribute('autoplay', this.autoplay);
    this.nativeEl.toggleAttribute('loop', this.loop);
    this.nativeEl.toggleAttribute('controls', this.controls);
    this.nativeEl.toggleAttribute('muted', this.defaultMuted || this.muted);
  }

  get api() {
    return this.nativeEl;
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

function populate(tpl, obj) {
  return tpl.replace(
    /\{\{\s*([\w-]+)([=?|])?([^\s}]+?)?\s*\}\}/g,
    function (match, key, mod, fallback) {
      let val = obj[key];
      val = val != null ? val : fallback;
      if (val != null) {
        return val;
      }
      return '';
    }
  );
}

const loadScriptCache = {};
async function loadScript(src, globalName) {
  if (!globalName) return import(src);
  if (loadScriptCache[src]) return loadScriptCache[src];
  if (self[globalName]) return self[globalName];
  return (loadScriptCache[src] = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.defer = true;
    script.src = src;
    script.onload = () => resolve(self[globalName]);
    script.onerror = reject;
    document.head.append(script);
  }));
}

if (!globalThis.customElements.get('player-x')) {
  globalThis.customElements.define('player-x', Playerx);
}

export { options, Playerx };

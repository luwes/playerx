import { defineCustomElement } from './element.js';
import { loadScript, findAncestor } from './utils.js';

export class PlxScript extends HTMLElement {
  static get observedAttributes() {
    return ['loading', 'src'];
  }

  get player() {
    if (this.hasAttribute('player')) {
      return document.querySelector(`#${this.getAttribute('player')}`);
    }
    return findAncestor(this, 'player-x');
  }

  get loading() {
    return this.getAttribute('loading');
  }

  set loading(loading) {
    this.setAttribute('loading', loading);
  }

  get src() {
    return this.getAttribute('src');
  }

  set src(src) {
    this.setAttribute('src', src);
  }

  connectedCallback() {
    const element = this;
    const { player } = this;
    if (!player || this._didConnect) return;

    this._didConnect = true;

    if (customElements.get(player.localName)) {
      onDefined();
    } else {
      customElements.whenDefined(player.localName).then(onDefined);
    }

    function onDefined() {
      const proto = Object.getPrototypeOf(player);
      const { load } = proto;

      // el.loading == player
      Object.assign(proto, {
        async load() {
          await loadScript(
            Object.fromEntries(
              Array.from(element.attributes).map(({ name, value }) => [
                name,
                value,
              ])
            )
          );
          return load.call(this);
        },
      });
    }
  }
}

defineCustomElement('plx-script', PlxScript);

/* eslint fp/no-this:0 */
import { assign } from './assign.js';

export function define(name, fn, observedAttributes) {

  const CE = class extends HTMLElement {
    constructor(options) {
      super();
      assign(this, fn(this, options));
    }

    connectedCallback() {
      this._connected && this._connected();
    }

    disconnectedCallback() {
      this._disconnected && this._disconnected();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      this._attributeChanged && this._attributeChanged(name, oldValue, newValue);
    }

    adoptedCallback() {
      this._adopted && this._adopted();
    }
  };

  CE.observedAttributes = observedAttributes;
  customElements.define(name, CE);
  return CE;
}

/* eslint fp/no-this:0 */
export function define(name, fn, observedAttributes) {

  const CE = class extends HTMLElement {
    constructor(...args) {
      super();
      fn(this, ...args);
      console.dir(this);
    }

    connectedCallback() {
      this._connected && this._connected();
    }

    disconnectedCallback() {
      this._disconnected && this._disconnected();
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
      this._attributeChanged && this._attributeChanged(attrName, oldValue, newValue);
    }

    // adoptedCallback() {
    //   this._adopted && this._adopted();
    // }
  };

  CE.observedAttributes = observedAttributes;
  Promise.resolve().then(() => customElements.define(name, CE));
  return CE;
}

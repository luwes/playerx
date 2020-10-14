
(self.Promise && self.CustomEvent && Array.from) || document.write(
  '<script src="//polyfill.io/v3/polyfill.min.js?features=Promise%2CCustomEvent%2CArray.from"></script>'
);

self.customElements || document.write(
  '<script src="//unpkg.com/@webcomponents/custom-elements"></script>'
);

(function(){if(void 0===window.Reflect||void 0===window.customElements||window.customElements.polyfillWrapFlushCallback)return;const a=HTMLElement;window.HTMLElement={HTMLElement:function HTMLElement(){return Reflect.construct(a,[],this.constructor)}}.HTMLElement,HTMLElement.prototype=a.prototype,HTMLElement.prototype.constructor=HTMLElement,Object.setPrototypeOf(HTMLElement,a);})();

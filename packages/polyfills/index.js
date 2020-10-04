
(self.Promise && self.CustomEvent && Array.from) || document.write(
  '<script src="//polyfill.io/v3/polyfill.min.js?features=Promise%2CCustomEvent%2CArray.from"></script>'
);

self.customElements || document.write(
  '<script src="//unpkg.com/@webcomponents/custom-elements"></script>\
  <script src="//unpkg.com/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"></script>'
);

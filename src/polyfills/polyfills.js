(self.Promise && self.CustomEvent && Array.from) ||
  document.write(
    '<script src="//polyfill.io/v3/polyfill.min.js?features=Promise%2CCustomEvent%2CArray.from"><\x2fscript>'
  );

function LI() {
  return self.Reflect.construct(HTMLLIElement, [], LI);
}

if (self.customElements) {
  let fixBuiltIn;
  try {
    LI.prototype = HTMLLIElement.prototype;
    const is = 'extends-li';
    self.customElements.define(is, LI, { extends: 'li' });
    fixBuiltIn = document.createElement('li', { is }).outerHTML.indexOf(is) < 0;
  } catch (s) {
    fixBuiltIn = true;
  }
  if (fixBuiltIn) {
    document.write(
      '<script src="//unpkg.com/@webreflection/custom-elements-builtin"><\x2fscript>'
    );
  }
} else {
  document.write(
    '<script src="//unpkg.com/@webcomponents/custom-elements"><\x2fscript>'
  );
}

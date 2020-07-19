import 'native-promise-only';
import '@webcomponents/custom-elements';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';

if (!Array.from) {
  Array.from = function (object) {
    return [].slice.call(object);
  };
}

if (typeof window.CustomEvent !== 'function') {
  window.CustomEvent = function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: null };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.detail
    );
    return evt;
  };
}

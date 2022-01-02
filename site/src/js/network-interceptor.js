interceptNetworkRequests({
  onFetchLoad: (type, arrayBuffer) => onbufferload({ type, total: arrayBuffer.byteLength }),
  onLoad: (e) => onbufferload({ type: e.target.responseType, total: e.total }),
});

function interceptNetworkRequests(ee) {
  const open = XMLHttpRequest.prototype.open;
  const send = XMLHttpRequest.prototype.send;

  const isRegularXHR = open.toString().indexOf('native code') !== -1;

  // don't hijack if already hijacked - this will mess up with frameworks like Angular with zones
  // we work if we load first there which we can.
  if (isRegularXHR) {
    XMLHttpRequest.prototype.open = function () {
      ee.onOpen && ee.onOpen(this, arguments);
      if (ee.onLoad) {
        this.addEventListener('load', ee.onLoad.bind(ee));
      }
      if (ee.onError) {
        this.addEventListener('error', ee.onError.bind(ee));
      }
      return open.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function () {
      ee.onSend && ee.onSend(this, arguments);
      return send.apply(this, arguments);
    };
  }

  const fetch = window.fetch || '';
  // don't hijack twice, if fetch is built with XHR no need to decorate, if already hijacked
  // then this is dangerous and we opt out
  const isFetchNative = fetch.toString().indexOf('native code') !== -1;
  if (isFetchNative) {
    window.fetch = function () {
      ee.onFetch && ee.onFetch(arguments);
      const p = fetch.apply(this, arguments);
      p.then(ee.onFetchResponse, ee.onFetchError);
      return p;
    };
    // at the moment, we don't listen to streams which are likely video
    const json = Response.prototype.json;
    const text = Response.prototype.text;
    const arrayBuffer = Response.prototype.arrayBuffer;
    Response.prototype.json = function () {
      const p = json.apply(this, arguments);
      p.then(ee.onFetchLoad && ee.onFetchLoad.bind(ee, 'json'));
      return p;
    };
    Response.prototype.text = function () {
      const p = text.apply(this, arguments);
      p.then(ee.onFetchLoad && ee.onFetchLoad.bind(ee, 'text'));
      return p;
    };
    Response.prototype.arrayBuffer = function () {
      const p = arrayBuffer.apply(this, arguments);
      p.then(ee.onFetchLoad && ee.onFetchLoad.bind(ee, 'arraybuffer'));
      return p;
    };
  }
  return ee;
}

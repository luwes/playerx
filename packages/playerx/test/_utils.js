export function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function removeNode(node) {
  let parentNode = node.parentNode;
  if (parentNode) parentNode.removeChild(node);
}

export function beforeEach(test, handler) {
  return function tapish(name, cb) {
    test(name, function(assert) {
      let _end = assert.end;
      assert.end = function() {
        assert.end = _end;
        cb(assert);
      };
      handler(assert);
    });
  };
}

export function withRetries(test) {
  return function retry(name, cb, retryCount = 0, retryName) {
    test(retryName || name, function(t) {

      let retries = 0;
      t.retries = function(val) {
        retries = val;
      };

      let end = t.end;
      t.end = function(err) {
        end(err);
        t.end = () => {}; // only call end() once.
        clearTimeout(timeout);
      };

      let timeout;
      t.timeoutAfter = function(ms) {
        timeout = setTimeout(() => {
          if (retryCount < retries) {
            t.retry(`Retrying on timeout after ${ms}ms`);
          } else {
            t.fail(`${name} timed out after ${ms}ms`);
            t.end();
          }
        }, ms);
      };

      let _assert = t._assert;
      t._assert = function(ok, opts) {
        if (!ok) {
          t.retry(`Retrying on failing assert "${opts.message}"`);
        }
        _assert(ok, { ...opts, extra: { skip, ...opts.extra } });
      };

      let skip = false;
      t.retry = function(msg) {
        if (!skip && retryCount < retries) {
          skip = true;
          if (msg) t.comment(msg);
          t.end();
          retry(name, cb, ++retryCount, `Retry ${retryCount} "${name}"`);
        }
      };

      cb(t);
    });
  };
}

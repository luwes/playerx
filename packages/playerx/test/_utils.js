import UAParser from 'ua-parser-js';

export function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function removeNode(node) {
  let parentNode = node.parentNode;
  if (parentNode) parentNode.removeChild(node);
}

export const isTestEnabled = (type, tests) => {
  const testSection = tests[type];
  if (!testSection) return false;

  if (typeof testSection === 'object' && testSection.browsers) {
    const parser = new UAParser();
    const browserKey = Object.keys(testSection.browsers).find((key) =>
      parser.getBrowser().name.toLowerCase().includes(key)
    );
    if (!testSection.browsers[browserKey]) return false;
  }

  return true;
};

export function tapePrefix(test) {
  return function (name, opts, cb) {
    test(name, opts, function (t) {
      let _assert = t._assert;
      t._assert = function (ok, _opts) {
        _opts.message = t.prefix(_opts.message);
        _assert(ok, _opts);
      };
      cb(t);
    });
  };
}

export function tapeRetries(test) {
  return function retry(name, opts, cb, retryCount = 0, retryName) {
    test(retryName || name, opts, function (t) {
      let retries = 0;
      t.retries = function (val) {
        retries = val;
      };

      let end = t.end;
      t.end = function (err) {
        end(err);
        t.end = () => {}; // only call end() once.
        clearTimeout(timeout);
      };

      let timeout;
      t.timeoutAfter = function (ms) {
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
      t._assert = function (ok, _opts) {
        if (!ok && !_opts.skip && !_opts.extra.skip) {
          t.retry(`Retrying on failing assert "${_opts.message}"`);
        }
        _assert(ok, { ..._opts, skip });
      };

      let skip = false;
      t.retry = async function (msg) {
        if (!skip && retryCount < retries) {
          skip = true;
          if (msg) t.comment(msg);
          t.end();

          ++retryCount;
          // Wait one tick so the rest of assertions are skipped before the retry.
          await Promise.resolve();
          retry(name, opts, cb, retryCount, `Retry ${retryCount} "${name}"`);
        }
      };

      cb(t);
    });
  };
}

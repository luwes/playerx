
/**
 * A utility to create Promises with convenient public resolve and reject methods.
 * @return {Promise}
 */
export function publicPromise() {
  let resolvePromise;
  let rejectPromise;

  let promise = new Promise(function(resolve, reject) {
    resolvePromise = resolve;
    rejectPromise = reject;
  });

  promise.resolve = (...args) => (resolvePromise(...args), promise);
  promise.reject = (...args) => (rejectPromise(...args), promise);

  return promise;
}

export function promisify(fn, ctx) {
  return (...args) => new Promise((resolve) => {
    // fn.call() didn't work for some reason.
    fn.bind(ctx)(...args, (...res) => {
      resolve(...res);
    });
  });
}

/**
 * Returns a promise that will resolve after passed ms.
 * @param  {number} ms
 * @return {Promise}
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

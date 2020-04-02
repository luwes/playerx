
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

  promise._resolve = resolvePromise;
  promise._reject = rejectPromise;

  return promise;
}

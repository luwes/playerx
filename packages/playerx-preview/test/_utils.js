export function beforeEach(test, handler) {
  return function tapish(name, listener) {
    test(name, function(assert) {
      let _end = assert.end;
      assert.end = function() {
        assert.end = _end;
        listener(assert);
      };

      handler(assert);
    });
  };
}

export function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

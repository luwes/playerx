
export function lite({ load, createProp }) {
  createProp('lite', false);

  function liteLoad() {
    console.log('liteLoad');
    return load();
  }

  return {
    load: liteLoad
  };
}


export function lite({ load, createProp }) {
  createProp('lite', false);

  function liteLoad() {
    console.log(99);
    return load();
  }

  return {
    load: liteLoad
  };
}

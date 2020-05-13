export const lite = CE => ({ load }) => {
  CE.defineProp('lite', false);

  function liteLoad() {
    return load();
  }

  return {
    load: liteLoad,
  };
};

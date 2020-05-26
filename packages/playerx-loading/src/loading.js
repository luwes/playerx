export const loading = CE => {

  CE.defineProp('loading', {
    get: (el, val) => val,
    set: (el, val) => val,
    reflect: true,
  });

  return player => {
    const { load, play } = player;

    function newLoad() {
      if (player.loading === 'user') return;
      return load();
    }

    async function newPlay() {
      await load();
      player.play = play;
      player.load = load;
      return play();
    }

    return {
      play: newPlay,
      load: newLoad,
    };
  };
};

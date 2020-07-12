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
      // watch out calling load() here
      // await load();
      //
      // in demo calling this on page load would result in a nested load() call
      // player.ready()
      //   .then(() => {
      //     console.error(player.play());
      //   });
      //
      // caused MUX to misreport pageload, player startup time and empty sessions
      player.play = play;
      return play();
    }

    return {
      play: newPlay,
      load: newLoad,
    };
  };
};

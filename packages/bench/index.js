const assert = require('assert');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2), {
  default: {
    player: null,
  },
});

const players = {
  dailymotion: {},
  streamable: {},
  twitch: {},
  brightcove: {},
  facebook: {},
  file: {},
  'jw-player': {},
  soundcloud: {},
  vidyard: {},
  vimeo: {},
  wistia: {},
  youtube: {},
};

describe('Basic playback', function() {
  Object.keys(players).forEach(player => {

    it(`${player } plays back the test video`, function() {
      let url = `https://dev.playerx.io/demo/${player}/`;

      browser.url(url);
      expect(browser).toHaveTitle('Playerx - API Demo');

      browser.setTimeout({ script: 30000 });

      console.warn(`Starting playback for ${player}`);
      assert(browser.executeAsync(async function(done) {
        const plx = document.querySelector('player-x');
        await plx.play();
        done(true);
      }));

      console.warn(`Seeking 10s from the end for ${player}`);
      assert(browser.executeAsync(async function(done) {
        setTimeout(() => {
          const plx = document.querySelector('player-x');
          plx.currentTime = plx.duration - 10;
          done(true);
        }, 10000);
      }));

      console.warn(`Waiting until ended for ${player}`);
      assert(browser.executeAsync(async function(done) {
        const plx = document.querySelector('player-x');
        plx.on('ended', () => done(true));
      }));

    });

  });
});

const assert = require('assert');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2), {
  default: {
    player: null,
    seek: false,
    clip: null,
    saucenetwork: null
  },
});

const players = {
  brightcove: {},
  dailymotion: {},
  // facebook: {},    // facebook doesn't start playback
  file: {},
  'jw-player': {},
  // soundcloud: {},  // less useful to test compared to video players
  streamable: {},
  twitch: {},
  vidyard: {},
  vimeo: {},
  wistia: {},
  youtube: {},
};


module.exports = function(player) {

  describe(`Playback${argv.saucenetwork ? ` (${argv.saucenetwork})` : ''}: ${player}`, function() {

    it(`${player } plays back the test video`, function() {
      let url = `https://dev.playerx.io/demo/${player}/`;
      if (argv.clip) url += `${argv.clip}/`;

      if (argv.saucenetwork) {
        // @see https://webdriver.io/docs/api/saucelabs.html#parameters-1
        // network condition to set (e.g. 'online', 'offline', 'GPRS', 'Regular 2G', 'Good 2G', 'Regular 3G', 'Good 3G', 'Regular 4G', 'DSL', 'Wifi')
        browser.throttleNetwork(argv.saucenetwork);
      }

      browser.url(url);
      expect(browser).toHaveTitle('Playerx - API Demo');

      browser.setTimeout({ script: 30000 });
      console.warn(`Starting playback for ${player}`);
      assert(browser.executeAsync(async function(done) {
        const plx = document.querySelector('player-x');
        await plx.ready();
        await plx.play();
        done(true);
      }));

      if (argv.seek) {
        console.warn(`Seeking 10s from the end for ${player}`);
        assert(browser.executeAsync(async function(done) {
          setTimeout(() => {
            const plx = document.querySelector('player-x');
            plx.currentTime = plx.duration - 10;
            done(true);
          }, 10000);
        }));
      } else {
        // If we don't seek play the whole clip of ~1.5min.
        browser.setTimeout({ script: 2 * 60 * 1000 });
      }

      console.warn(`Waiting until ended for ${player}`);
      assert(browser.executeAsync(async function(done) {
        const plx = document.querySelector('player-x');
        plx.on('ended', () => done(true));
      }));

    });

  });

};

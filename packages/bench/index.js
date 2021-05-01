const assert = require('assert');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2), {
  default: {
    seek: false,
    clip: null,
    saucenetwork: null
  },
});

module.exports = function(player) {

  describe(`Playback${argv.saucenetwork ? ` (${argv.saucenetwork})` : ''}: ${player}`, function() {

    it(`plays the test video`, function() {
      // Specify this test to only retry up to 2 times
      this.retries(2);

      let url = `https://dev.playerx.io/demo/${player}/`;
      if (argv.clip) url += `${argv.clip}/`;

      if (argv.saucenetwork) {
        // @see https://webdriver.io/docs/api/saucelabs.html#parameters-1
        // network condition to set (e.g. 'online', 'offline', 'GPRS', 'Regular 2G', 'Good 2G', 'Regular 3G', 'Good 3G', 'Regular 4G', 'DSL', 'Wifi')
        browser.throttleNetwork(argv.saucenetwork);
      }

      browser.url(url);
      expect(browser).toHaveTitle('Playerx - API Demo');

      if (process.env.MUX_ENV) {
        browser.execute(function(env) {
          window.MUX_ENV = env;
          document.querySelector('plx-mux').dataset.envKey = env;
        }, process.env.MUX_ENV);
      }

      browser.setTimeout({ script: 30000 });

      console.warn(`Wait ready for ${player}`);
      assert(browser.executeAsync(async function(done) {
        const plx = document.querySelector('player-x');
        await plx.ready();
        done(true);
      }));

      console.warn(`Starting playback for ${player}`);
      assert(browser.executeAsync(async function(done) {
        const plx = document.querySelector('player-x');

        // facebook on Android doesn't fire a playing event.
        const onTime = () => {
          plx.removeEventListener('timeupdate', onTime);
          done(true);
        };
        plx.addEventListener('timeupdate', onTime);

        plx.play();
        setTimeout(() => {
          if (plx.paused) plx.click();
        }, 1000);
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

        // facebook on Android doesn't fire an ended event.
        plx.addEventListener('timeupdate', () => {
          if (plx.currentTime >= Math.floor(plx.duration)) {
            done(true);
          }
        });
      }));

    });

  });

};

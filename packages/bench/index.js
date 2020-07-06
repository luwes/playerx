const playwright = require('playwright');
const minimist = require('minimist');

const ci = String(process.env.CI).match(/^(1|true)$/gi);
const argv = minimist(process.argv.slice(2), {
  default: {
    player: null,
  }
});

const players = {
  brightcove: {},
  // dailymotion: {},   // not starting playback
  facebook: {},
  file: {},
  'jw-player': {},
  soundcloud: {},
  // streamable: {},    // has ads so difficult to automate
  // twitch: {},        // not starting playback
  vidyard: {},
  vimeo: {},
  wistia: {},
  youtube: {},
};

const randomKey = function (obj) {
  var keys = Object.keys(obj);
  return keys[(keys.length * Math.random()) << 0];
};

const player = argv.player || randomKey(players);

(async () => {
  for (const browserType of ['chromium']) {
    const browser = await playwright[browserType].launch({
      executablePath: ci
        ? '/usr/bin/google-chrome'
        : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      // headless: false,
      args: [
        '--disable-web-security',
        '--no-user-gesture-required',
      ],
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    const url = `https://dev.playerx.io/demo/${player}/`;
    console.warn(`Loading ${url}`);
    await page.goto(url, {
      waitUntil: 'networkidle'
    });

    const plxElementHandle = await page.$('player-x');
    await page.evaluate((plx) => plx.ready(), plxElementHandle);

    console.warn(`Starting playback for ${player}`);
    await page.evaluate((plx) => plx.play(), plxElementHandle);

    await delay(10000);
    console.warn(`Seeking 10s from the end for ${player}`);
    await page.evaluate((plx) => {
      plx.currentTime = plx.duration - 10;
    }, plxElementHandle);

    console.warn(`Waiting until ended for ${player}`);
    await Promise.race([
      delay(20000),
      page.evaluate(
        (plx) =>
          new Promise((resolve) => {
            plx.on('ended', resolve);
          }),
        plxElementHandle
      )]
    );

    await browser.close();
  }
})();

/**
 * Returns a promise that will resolve after passed ms.
 * @param  {number} ms
 * @return {Promise}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

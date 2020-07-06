const playwright = require('playwright');
const minimist = require('minimist');
const NETWORK_PRESETS = require('./network.js');

const ci = String(process.env.CI).match(/^(1|true)$/gi);
const argv = minimist(process.argv.slice(2), {
  default: {
    player: null,
  },
});

const players = {
  // dailymotion: {},   // not starting playback
  // streamable: {},    // has ads so difficult to automate
  // twitch: {},        // not starting playback
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

const randomKey = function (obj) {
  var keys = Object.keys(obj);
  return keys[(keys.length * Math.random()) << 0];
};

const player = argv.player || randomKey(players);

const newyork = {
  latitude: 40.730610,
  longitude: -73.935242
};

const saopaulo = {
  latitude: -23.5475,
  longitude: -46.6361,
  network: NETWORK_PRESETS['Good3G']
};

async function runBenchmark(geolocation = newyork) {
  const browser = await playwright.chromium.launch({
    executablePath: ci
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    // headless: false,
    args: ['--disable-web-security', '--no-user-gesture-required'],
  });
  const context = await browser.newContext({
    geolocation,
    permissions: ['geolocation']
  });
  const page = await context.newPage();

  if (geolocation.network) {
    // Connect to Chrome DevTools
    const client = await page.context().newCDPSession(page);
    // Set throttling property
    await client.send('Network.emulateNetworkConditions', geolocation.network);
  }

  const url = `https://dev.playerx.io/demo/${player}/`;

  console.warn(`Loading ${url}`);
  await page.goto(url, {
    waitUntil: 'networkidle',
  });

  const plxElementHandle = await page.$('player-x');

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
    ),
  ]);

  await browser.close();
}

runBenchmark();
runBenchmark(saopaulo);

/**
 * Returns a promise that will resolve after passed ms.
 * @param  {number} ms
 * @return {Promise}
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

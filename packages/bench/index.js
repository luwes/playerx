const playwright = require('playwright');

const ci = String(process.env.CI).match(/^(1|true)$/gi);

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

(async () => {
  for (const browserType of ['chromium']) {
    const browser = await playwright[browserType].launch({
      executablePath: ci
        ? '/usr/bin/google-chrome'
        : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: false,
      args: [
        '--disable-web-security',
        '--no-user-gesture-required',
      ],
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(`https://dev.playerx.io/demo/${randomKey(players)}/`, {
      waitUntil: 'networkidle'
    });

    const plxElementHandle = await page.$('player-x');
    await page.evaluate((plx) => plx.play(), plxElementHandle);

    await page.evaluate(
      (plx) =>
        new Promise((resolve) => {
          plx.on('ended', resolve);
        }),
      plxElementHandle
    );

    await browser.close();
  }
})();

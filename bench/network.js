// @see https://github.com/ChromeDevTools/devtools-frontend/blob/80c102878fd97a7a696572054007d40560dcdd21/front_end/sdk/NetworkManager.js#L252-L274
module.exports = {
  slow3g: {
    offline: false,
    downloadThroughput: 500 * 1024 / 8 * .8,
    uploadThroughput: 500 * 1024 / 8 * .8,
    latency: 400 * 5,
  },
  fast3g: {
    offline: false,
    downloadThroughput: 1.6 * 1024 * 1024 / 8 * .9,
    uploadThroughput: 750 * 1024 / 8 * .9,
    latency: 150 * 3.75,
  }
};

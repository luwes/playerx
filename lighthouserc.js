module.exports = {
  ci: {
    collect: {
      numberOfRuns: 2,
      // maxWaitForLoad: 60,
      // staticDistDir: './site/public/lighthouse/',
      url: [
        'https://api.playerx.io/render?url=https%3A%2F%2Fembed.api.video%2Fvod%2Fvi7pA8Iz9m3S466XPu8qUJr',
        'https://api.playerx.io/render?url=https%3A%2F%2Fplayers.brightcove.net%2F1752604059001%2Fdefault_default%2Findex.html%3FvideoId%3D4883184247001',
        // 'https://dev.playerx.io/lighthouse/cloudflare/',
        // 'https://dev.playerx.io/lighthouse/dailymotion/',
        // 'https://dev.playerx.io/lighthouse/facebook/',
        // 'https://dev.playerx.io/lighthouse/jw-player/',
        // 'https://dev.playerx.io/lighthouse/mux/',
        // 'https://dev.playerx.io/lighthouse/streamable/',
        // 'https://dev.playerx.io/lighthouse/vidyard/',
        // 'https://dev.playerx.io/lighthouse/vimeo/',
        // 'https://dev.playerx.io/lighthouse/wistia/',
        // 'https://dev.playerx.io/lighthouse/youtube/',
      ]
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

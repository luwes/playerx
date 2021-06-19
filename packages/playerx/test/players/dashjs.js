import { testPlayer, defaultBrowsers } from '../player.js';

const src = 'https://65vod-adaptive.akamaized.net/exp=2482774255~acl=%2F680befac-de71-4a0d-a9fa-4036695333c8%2F%2A~hmac=ab3da00c114fce450c5673cfad9574647772778f518e46c58b9210c37cd54083/680befac-de71-4a0d-a9fa-4036695333c8/sep/video/007a89dc,51ae83f1,67d5d9c0,e9eb72f5,ed737100,d5b9a68c,6e0c0f7b/master.mpd?base64_init=1&ext=.mpd';
const duration = 46;

const tests = {
  play: {
    browsers: {
      ...defaultBrowsers(true),
      // DASH fails on Safari, not sure why
      safari: false,
    },
  },
};

testPlayer({ src, duration, tests });

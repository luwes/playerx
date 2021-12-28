// https://player.support.brightcove.com/coding-topics/overview-player-api.html
export const type = 'inline';
export const key = 'brightcove';
export const name = 'Brightcove';
export const url = 'https://www.brightcove.com';
export const srcPattern =
  'players\\.brightcove\\.net/(\\d+)/(\\w+)_(\\w+)/.*?videoId=(\\d+)';
export const metaId = '{{4}}';
export const jsUrl =
  'https://players.brightcove.net/{{1}}/default_default/index.min.js';
export const apiVar = 'bc';
export const version = '1.x.x';
export const html = `<video-js data-account="{{1}}" data-video-id="{{metaId}}" data-player="{{2}}" data-embed="{{3}}"{{class=}}{{id=}}{{width=}}{{height=}}{{preload=}}{{autoplay?}}{{muted?}}{{loop?}}{{controls?}}{{playsinline?}}{{autopictureinpicture?}}{{controlslist=}}{{crossorigin=}}></video-js>`;
export const scriptText = `{{callback}}({{apiVar}}({{node}}));`;

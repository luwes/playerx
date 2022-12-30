# <a href="https://github.com/luwes/playerx"><img src="https://dev.playerx.io/images/playerx-logo.svg?sanitize=true" height="36" alt="playerx" /></a>

[![Version](https://img.shields.io/npm/v/playerx.svg?color=success&style=flat-square)](https://www.npmjs.com/package/playerx)
[![Badge size](https://img.badgesize.io/https://cdn.jsdelivr.net/npm/playerx/dist/playerx.min.js?compression=gzip&label=gzip&style=flat-square)](https://bundlephobia.com/result?p=playerx)

**npm**: `npm i playerx`  
**cdn**: https://cdn.jsdelivr.net/npm/playerx  

## Features

- **Uniform player API** across player platforms. Mimics the `HTMLMediaElement` API when possible.
- **UI framework independent**, intentionally uses no specific framework to have great interop across the board and keep the bundle size in check.


## Usage ([Codesandbox](https://codesandbox.io/s/hello-playerx-22ku4))

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/playerx"></script>
<player-x src="https://vimeo.com/638369396" controls></player-x>
```

Demo page: [dev.playerx.io/demo](https://dev.playerx.io/demo/)


## Supported media

* Mux videos use the [Mux Player API](https://github.com/muxinc/elements/blob/main/packages/mux-player/REFERENCE.md)
* YouTube videos use the [YouTube iFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
* Vimeo videos use the [Vimeo Player API](https://developer.vimeo.com/player/sdk)
* Wistia videos use the [Wistia Player API](https://wistia.com/doc/player-api)
* JW Player videos use the [JW Player API](https://developer.jwplayer.com/jwplayer/docs/jw8-javascript-api-reference)
* [Supported file types](https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats) are playing using [`<video>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/video) or [`<audio>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/audio) elements
  * HLS streams are played using [`hls.js`](https://github.com/video-dev/hls.js)
  * DASH streams are played using [`dash.js`](https://github.com/Dash-Industry-Forum/dash.js)


## Related

- [Media Chrome](https://github.com/muxinc/media-chrome) Your media player's dancing suit. 🕺
- [`<mux-player>`](https://github.com/muxinc/elements/tree/main/packages/mux-player) The official Mux-flavored video player web component.
- [`<mux-video>`](https://github.com/muxinc/elements/tree/main/packages/mux-video) A Mux-flavored HTML5 video element w/ hls.js and Mux data builtin.
- [`<videojs-video>`](https://github.com/luwes/videojs-video-element) A web component for Video.js.
- [`<wistia-video>`](https://github.com/luwes/wistia-video-element) A web component for the Wistia player.
- [`<vimeo-video>`](https://github.com/luwes/vimeo-video-element) A web component for the Vimeo player.
- [`<jwplayer-video>`](https://github.com/luwes/jwplayer-video-element) A web component for the JW player.
- [`<hls-video>`](https://github.com/muxinc/hls-video-element) A web component for playing HTTP Live Streaming (HLS) videos.
- [`castable-video`](https://github.com/muxinc/castable-video) Cast your video element to the big screen with ease!


## Big Thanks

To all the services that offered free plans for building, testing and measuring!

- [Mux](https://mux.com/)
- [Cloudflare](https://www.cloudflare.com/)
- [JW Player](https://www.jwplayer.com/)
- [BrowserStack](https://www.browserstack.com/)
- [Sauce Labs](https://saucelabs.com)
- [Github](https://github.com/)

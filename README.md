# <a href="https://github.com/playerxo/playerx"><img src="https://playerx.io/images/playerx-logo.svg?sanitize=true" height="36" alt="playerx" /></a>

[![Version](https://img.shields.io/npm/v/playerx.svg?color=success&style=flat-square)](https://www.npmjs.com/package/playerx)
![Badge size](https://img.badgesize.io/https://unpkg.com/playerx/module/playerx.min.js?compression=gzip&label=gzip&style=flat-square)
[![codecov](https://img.shields.io/codecov/c/github/playerxo/playerx.svg?style=flat-square&color=success)](https://codecov.io/gh/playerxo/playerx)

**npm**: `npm i playerx`  
**cdn**: https://unpkg.com/playerx  
**module**: https://unpkg.com/playerx?module

## Features

- **Uniform player API** across player platforms. Mimics the `HTMLMediaElement` API when possible.
- **UI framework independent**, intentionally uses no specific framework to have great interop across the board and keep the bundle size in check.
- **Responsive** out of the box and easy attributes to maintain a specific aspect-ratio. 
- **Extensible** with powerful add-ons like custom previews, analytics, custom skins, etc.


## Usage ([Codesandbox](https://codesandbox.io/s/hello-playerx-22ku4))

```js
import 'playerx';

document.body.innerHTML = `
  <player-x src="https://vimeo.com/357274789"></player-x>
`;
```

Demo page: [dev.playerx.io/demo](https://dev.playerx.io/demo/)


## Browser Support

Playerx supports modern browsers and IE11+ (requires some polyfills).  
Include this script before importing Playerx.

```js
<script src="//unpkg.com/playerx/dist/polyfills.js"></script>
```

[![Sauce Test Status](https://saucelabs.com/browser-matrix/luwes.svg?sanitize=true)](https://saucelabs.com/u/luwes)


## Status

Playerx is in beta status, it can be used in production but use at your descretion.


## ⚠️ License

Be sure to read the [license](/LICENSE.md) terms. In most cases Playerx is free to use but if your project profits from this software you should buy a commercial license at [dev.playerx.io](https://dev.playerx.io/).


## Docs

### Properties

Prop | Description | Default
---- | ----------- | -------
`aspectRatio` | Is a `Number` that can set the preferred aspect ratio for the player. | `undefined`
`autoplay` | A `Boolean` that reflects the autoplay HTML attribute, indicating whether playback should automatically begin as soon as enough media is available to do so without interruption. | `false`
`buffered` <sub><sup>Read only</sup></sub> | Returns a `TimeRanges` object that indicates the ranges of the media source that the browser has buffered (if any) at the moment the buffered property is accessed. | `undefined`
`config` | A plain object that contains platform specific settings. See [`below`](#config-property) | 
`controls` | Is a Boolean that reflects the controls HTML attribute, indicating whether user interface items for controlling the resource should be displayed. | `false`
`currentSrc` <sub><sup>Read only</sup></sub> | Returns a DOMString with the absolute URL of the chosen media resource. | `''`
`currentTime` | A double-precision floating-point value indicating the current playback time in seconds; if the media has not started to play and has not been seeked, this value is the media's initial playback time. Setting this value seeks the media to the new time. The time is specified relative to the media's timeline. | `0`
`duration` <sub><sup>Read only</sup></sub> | A read-only double-precision floating-point value indicating the total duration of the media in seconds. If no media data is available, the returned value is `NaN`. If the media is of indefinite length (such as streamed live media, a WebRTC call's media, or similar), the value is `+Infinity`. | `NaN`
`ended` <sub><sup>Read only</sup></sub> | Returns a `Boolean` that indicates whether the media element has finished playing. | `false`
`error` <sub><sup>Read only</sup></sub> | | `null`
`height` | Is a DOMString that reflects the height HTML attribute, which specifies the height of the display area, in CSS pixels. | `undefined`
`loop` | A `Boolean` that reflects the loop HTML attribute, which indicates whether the media element should start over when it reaches the end. | `false`
`muted` | Is a `Boolean` that determines whether audio is muted. `true` if the audio is muted and `false` otherwise. | `false`
`paused` <sub><sup>Read only</sup></sub> | Returns a `Boolean` that indicates whether the media element is paused. | `true`
`playbackRate` | Is a double that indicates the rate at which the media is being played back. | `1`
`playing` | Is a `Boolean` that reflects the playing HTML attribute, that can play and pause playback. | `false`
`playsinline` | A Boolean attribute indicating that the video is to be played "inline", that is within the element's playback area. Note that the absence of this attribute does not imply that the video will always be played in fullscreen. | `false`
`preload` | Is a `DOMString` that reflects the preload HTML attribute, indicating what data should be preloaded, if any. Possible values are: `none`, `metadata`, `auto`. | `undefined`
`src` | Is a `String` that reflects the src HTML attribute, which contains the URL of a media resource to use. | `undefined`
`videoHeight` <sub><sup>Read only</sup></sub> | Returns an unsigned integer value indicating the intrinsic height of the resource in CSS pixels, or 0 if no media is available yet. | `0`
`videoWidth` <sub><sup>Read only</sup></sub> | Returns an unsigned integer value indicating the intrinsic width of the resource in CSS pixels, or 0 if no media is available yet. | `0`
`volume` | Is a double indicating the audio volume, from 0.0 (silent) to 1.0 (loudest). | `1`
`width` | Is a DOMString that reflects the width HTML attribute, which specifies the width of the display area, in CSS pixels. | `undefined`

#### `config` property

Key | Options
------ | -----------
`brightcove` | `account: ''` Account key
`dailymotion` | See all [custom options](https://developer.dailymotion.com/player#player-parameters)
`facebook` | `appId: ''` Your own [Facebook app ID](https://developers.facebook.com/docs/apps/register#app-id)<br />`version: 'v3.2'`: Facebook SDK version
`jwplayer` | See all [custom options](https://developer.jwplayer.com/jwplayer/docs/jw8-player-configuration-reference) <br>`player: ''` Player ID used in the player URL. <br>`key: ''` Or via a key for the advanced embed.
`soundcloud` | See all [custom options](https://developers.soundcloud.com/docs/api/html5-widget#params)
`vidyard` | See all [custom options](https://knowledge.vidyard.com/hc/en-us/articles/360009879754-Use-query-strings-to-override-player-settings)
`vimeo` | See all [custom options](https://github.com/vimeo/player.js#embed-options) <br>`color: '00adef'` Specify the color of the video controls. Colors may be overridden by the embed settings of the video. <br>`title: true` Show the title on the video. <br>`byline: true` Show the byline on the video. <br>`portrait: true` Show the portrait on the video.
`wistia` | See all [custom options](https://wistia.com/doc/embed-options#options_list)
`youtube` | See all [custom options](https://developers.google.com/youtube/player_parameters?playerVersion=HTML5) <br>`rel: 0` If the rel parameter is set to 0, related videos will come from the same channel as the video that was just played. <br>`iv_load_policy: 3` Setting the parameter's value to 1 causes video annotations to be shown by default, whereas setting to 3 causes video annotations to not be shown by default. <br>`modestbranding: 1` This parameter lets you use a YouTube player that does not show a YouTube logo. Set the parameter value to 1 to prevent the YouTube logo from displaying in the control bar. Note that a small YouTube text label will still display in the upper-right corner of a paused video when the user's mouse pointer hovers over the player.


### Methods

#### Instance Methods

Method | Description
------ | -----------
`play(): Promise` | Begins playback of the media, returns a promise that resolves when playing starts.
`pause(): void` | Pauses the media playback.
`addEventListener(name, handler, opts): void` | The `EventTarget` method sets up a function that will be called whenever the specified event is delivered to the target.
`removeEventListener(name, handler, opts): void` | This method removes from the `EventTarget` an event listener previously registered.
`ready(): Promise` | Trigger a function when the player has initialized. You do not need to wait for ready to trigger to begin adding event listeners or calling other methods.
`load(): Promise` | Resets the media to the beginning and selects the best available source from the sources provided using the src attribute or the `<source>` element.


### Events

Event | Description
------ | -----------
`durationchange` |
`ended` |
`error` |
`loadedsrc` |
`loadsrc` |
`loadstart` |
`pause` |
`play` |
`playing` |
`progress` |
`ratechange` |
`ready` |
`timeupdate` |
`volumechange` |



## Supported media

* YouTube videos use the [YouTube iFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
* Facebook videos use the [Facebook Embedded Video Player API](https://developers.facebook.com/docs/plugins/embedded-video-player/api)
* SoundCloud tracks use the [SoundCloud Widget API](https://developers.soundcloud.com/docs/api/html5-widget)
* Streamable videos use [`Player.js`](https://github.com/embedly/player.js)
* Vimeo videos use the [Vimeo Player API](https://developer.vimeo.com/player/sdk)
* Wistia videos use the [Wistia Player API](https://wistia.com/doc/player-api)
* Twitch videos use the [Twitch Interactive Frames API](https://dev.twitch.tv/docs/embed#interactive-frames-for-live-streams-and-vods)
* DailyMotion videos use the [DailyMotion Player API](https://developer.dailymotion.com/player)
* Vidyard videos use the [Vidyard Player API](https://knowledge.vidyard.com/hc/en-us/articles/360019034753-Using-the-Vidyard-Player-API)
* [Supported file types](https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats) are playing using [`<video>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/video) or [`<audio>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/audio) elements
  * HLS streams are played using [`hls.js`](https://github.com/video-dev/hls.js)
  * DASH streams are played using [`dash.js`](https://github.com/Dash-Industry-Forum/dash.js)


## Similar Projects

- [React Player](https://github.com/CookPete/react-player)


## Big Thanks

To all the services that offered free plans for building, testing and measuring!

- [MUX](https://mux.com/)
- [BrowserStack](https://www.browserstack.com/)
- [Sauce Labs](https://saucelabs.com)
- [Travis CI](https://travis-ci.com/)
- [Github](https://github.com/)

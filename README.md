# <a href="https://github.com/luwes/playerx"><img src="https://playerx.io/images/playerx-logo.svg?sanitize=true" height="36" alt="playerx" /></a>

[![Version](https://img.shields.io/npm/v/playerx.svg?color=success&style=flat-square)](https://www.npmjs.com/package/playerx)
![Badge size](https://img.badgesize.io/https://unpkg.com/playerx/module/playerx.min.js?compression=gzip&label=gzip&style=flat-square)
[![codecov](https://img.shields.io/codecov/c/github/luwes/playerx.svg?style=flat-square&color=success)](https://codecov.io/gh/luwes/playerx)

**npm**: `npm i playerx`  
**cdn**: https://unpkg.com/playerx  
**module**: https://unpkg.com/playerx?module

## Features

- **Uniform player API** across player platforms. The end result is an API that comes close the `HTMLMediaElement` API.
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
`brightcove` |
`dailymotion` |
`facebook` |
`file` |
`jwplayer` | 
`soundcloud` |
`vidyard` |
`vimeo` |
`wistia` | 
`youtube` |


### Methods

#### Static Methods

Method | Description
------ | -----------
`canPlay(src): Boolean` | 


#### Instance Methods

Method | Description
------ | -----------
`play(): Promise` | 
`pause(): void` | 
`addEventListener(name, handler, opts): void` |
`removeEventListener(name, handler, opts): void` |
`ready(): Promise` |


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


## Status

Playerx is in early preview and needs more test coverage to be fully production ready. We aim to have the Playerx core in a ready state by August 2020. Documentation is also high on the todo list.


## ⚠️ License

Be sure to read the [license](/LICENSE.md) terms. In most cases Playerx is free to use but if your project profits from this software you should buy a commercial license at [dev.playerx.io](https://dev.playerx.io/).


## Similar Projects

- [React Player](https://github.com/CookPete/react-player)

# <a href="https://github.com/luwes/playerx"><img src="https://playerx.io/images/playerx-logo.svg?sanitize=true" height="36" alt="playerx" /></a>

[![Version](https://img.shields.io/npm/v/playerx.svg?color=success&style=flat-square)](https://www.npmjs.com/package/playerx)
![Badge size](https://img.badgesize.io/https://unpkg.com/playerx/module/playerx.min.js?compression=gzip&label=gzip&style=flat-square)
[![codecov](https://img.shields.io/codecov/c/github/luwes/playerx.svg?style=flat-square&color=success)](https://codecov.io/gh/luwes/playerx)

**npm**: `npm i playerx`  
**cdn**: https://unpkg.com/playerx  
**module**: https://unpkg.com/playerx?module

---

Playerx is a lightweight player web component with a uniform player API. It supports raw media files, HLS, Dash, Vimeo, YouTube, JW Player, Wistia, SoundCloud, Twitch, Dailymotion, Facebook, Vidyard, Brightcove, Streamable.


### Usage ([Codesandbox](https://codesandbox.io/s/hello-playerx-22ku4))

```js
import 'playerx';

document.body.innerHTML = `
  <player-x src="https://vimeo.com/357274789"></player-x>
`;
```


### Status

Playerx is in early preview and needs more test coverage to be fully production ready. We aim to have the Playerx core in a great state by August 2020. Documentation is also high on the todo list.


### License

Be sure to read the [license](/LICENSE.md) terms. In most cases Playerx is free to use but if your project profits from this software you should buy a commercial license at [dev.playerx.io](https://dev.playerx.io/).


## Similar Projects

- [React Player](https://github.com/CookPete/react-player)

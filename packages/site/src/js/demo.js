/* global selectPlayer, selectClip */
import { observable, computed } from 'sinuous/observable';
import { dhtml, hydrate as hy } from 'sinuous/hydrate';
import { onconnected, ondisconnected } from './logger.js';
import {
  toHHMMSS,
  round,
  computedValue,
  qs,
  prettyQuality,
  tryJSONParse,
} from './utils/utils.js';
import { getParam } from './utils/url.js';

const query = `[data-player="${selectPlayer}"][data-clip="${selectClip}"]`;
const defaults = {
  src: qs(query).dataset.src,
  autoplay: false,
  controls: true,
  loop: false,
  muted: true,
  preload: 'none',
  volume: 1,
};

const src = observable();
const showing = computedValue(() => !!src());
const autoplay = observable(getParam('autoplay'));
const playing = observable(false);
const volume = observable(getParam('volume', defaults.volume));
const volumeValue = observable(volume());
const buffered = observable(0);
const duration = observable(0);
const currentTime = observable(0);
const currentTimeValue = observable(0);
const ended = observable(false);
const muted = observable(getParam('muted', defaults.muted));
const mutedValue = observable(muted());
const loop = observable(getParam('loop'));
const controls = observable(getParam('controls', defaults.controls));
const preload = observable(getParam('preload', defaults.preload));
const videoHeight = observable();
const quality = computed(() => prettyQuality(videoHeight()));
const unsupportsPlaybackRate = observable(true);
const unsupportsControls = observable(true);
const playsinline = true;

setSrc(getParam('src', defaults.src));

const config = {
  facebook: {
    appId: '197575574668798',
  },
  jwplayer: {
    player: 'IxzuqJ4M',
  },
  brightcove: {
    account: '1752604059001',
  },
};

const props = {
  src,
  autoplay,
  playing,
  currentTime,
  muted,
  loop,
  controls,
  preload,
  playsinline,
  volume,
  config,
  onconnected,
  ondisconnected,
  onpause: () => playing(false),
  onplay: () => playing(true),
  onplaying: () => playing(true),
  onended: () => playing(false),
  ondurationchange: () => player.duration && duration(player.duration),
  onseeking: () => currentTimeValue(player.currentTime),
  onseeked: () => currentTimeValue(player.currentTime),
  ontimeupdate: () => {
    currentTimeValue(player.currentTime);
    ended(player.ended);
  },
  onresize: () => {
    videoHeight(player.videoHeight);
  },
  onvolumechange: () => {
    volumeValue(player.volume);
    mutedValue(player.muted);
  },
  onprogress: () => {
    const len = player.buffered.length;
    if (len && duration()) {
      buffered(player.buffered.end(len - 1) / duration());
    }
  },
  onloadedsrc: () => {
    unsupportsPlaybackRate(!player.supports('playbackRate'));
    unsupportsControls(!player.supports('controls'));
  },
};

/** @typedef { import('playerx').Playerx } Playerx */

/** @type Playerx */
let player;
player = hy(dhtml`
  ${() => showing() && (player = dhtml`
    <player-x ...${props}>
      <plx-media></plx-media>
      <plx-script src="${player?.children?.[1].src}"></plx-script>
      <plx-mux
        data-env-key="${window.MUX_ENV || player?.children?.[2]?.dataset.envKey}"
        debug="${player?.children?.[2]?.debug}"
      ></plx-mux>
    <//>
  `)}
`);

onconnected({ target: player });

// player.ready()
//   .then(() => {
//     console.error(player.play());
//   });

hy(dhtml`
  <div class="sources" onclick=${(e) => setSrc(e.target.dataset.src)}>
    ${[...Array(30)].map(
      () => dhtml`
      <div>
        <b />
        <button class="btn src-btn${darkOnSelect}" />
        <button class="btn src-btn${darkOnSelect}" />
        <button class="btn src-btn${darkOnSelect}" />
        <button class="btn src-btn${darkOnSelect}" />
      </div>
    `
    )}
  </div>
`);

hy(dhtml`
  <input id=inputsrc onkeydown=${(e) => {
    if (e.target.value && e.keyCode == 13) {
      setSrc(e.target.value);
      e.target.value = '';
    }
  }} />
`);

function setSrc(dataSrc) {
  buffered(0);
  videoHeight(0);
  if (dataSrc) {
    src(tryJSONParse(dataSrc));
  }
}

function darkOnSelect() {
  return src() === tryJSONParse(this.el.dataset.src)
    ? ' btn-active'
    : '';
}

hy(dhtml`
  <div id="controls-1">
    <button onclick=${() => playing(!playing())}>
      ${() => (playing() ? 'Pause' : 'Play')}
    </button>
    <button onclick=${stop} />
    <button onclick=${remove} />
  </div>
`);

function stop() {
  playing(false);
  player.stop();
}

function remove() {
  playing(false);
  src('');
}

hy(dhtml`
  <div id="controls-2">
    <button onclick=${() =>
      player.set('playbackRate', 0.5)} disabled=${unsupportsPlaybackRate} />
    <button onclick=${() =>
      player.set('playbackRate', 1)} disabled=${unsupportsPlaybackRate} />
    <button onclick=${() =>
      player.set('playbackRate', 2)} disabled=${unsupportsPlaybackRate} />
  </div>
`);

hy(dhtml`
  <input id="current-time-range"
    value=${() => currentTimeValue() / duration() || 0}
    oninput=${(e) => currentTime(e.target.value * duration())} />
`);

hy(dhtml`
  <input id="volume-range"
    value=${() => volumeValue() || 0}
    oninput=${(e) => volume(e.target.value)} />
`);

hy(dhtml`
  <div class="state-values">
    <b /><i>${() => String(!playing())}</i>
    <b /><i>${() => round(volumeValue(), 2)}</i>
    <b /><i>${() => round(buffered(), 2)}</i>
    <b /><i>${() => toHHMMSS(duration())}</i>
    <b /><i>${() => toHHMMSS(currentTimeValue())}</i>
    <b /><i>${() => String(ended())}</i>
    <b /><i>${() => String(quality())}</i>
  </div>
`);

hy(dhtml`
  <input id="autoplay" oninput=${(e) =>
    autoplay(e.target.checked)} checked=${autoplay} />
`);

hy(dhtml`
  <input id="muted" oninput=${(e) =>
    muted(e.target.checked)} checked=${mutedValue} />
`);

hy(dhtml`
  <input id="loop" oninput=${(e) => loop(e.target.checked)} checked=${loop} />
`);

hy(dhtml`
  <input id="controls" disabled=${unsupportsControls} oninput=${(e) =>
  controls(e.target.checked)} checked=${controls} />
`);

export { defaults, autoplay, muted, controls, loop, src };

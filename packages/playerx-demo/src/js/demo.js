/* global selectPlayer */
import { observable } from 'sinuous/observable';
import { dhtml, hydrate as hy } from 'sinuous/hydrate';
import { onconnected, ondisconnected } from './logger.js';
import { toHHMMSS, round, computedValue, qs } from './utils/utils.js';
import { getParam } from './utils/url.js';

const clip = 1;
const query = `[data-player="${selectPlayer}"][data-clip="${clip}"]`;
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
const volumeValue = observable(1);
const buffered = observable(0);
const duration = observable(0);
const currentTime = observable(0);
const currentTimeValue = observable(0);
const ended = observable(false);
const muted = observable(getParam('muted', defaults.muted));
const loop = observable(getParam('loop'));
const controls = observable(getParam('controls', defaults.controls));
const preload = observable(getParam('preload', defaults.preload));

setSrc(getParam('src', defaults.src));

const props = {
  src,
  autoplay,
  playing,
  currentTime,
  muted,
  loop,
  controls,
  preload,
  volume,
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
  onvolumechange: () => {
    volumeValue(player.volume);
    muted(player.muted);
  },
  onprogress: () => {
    const len = player.buffered.length;
    if (len && duration()) {
      buffered(player.buffered.end(len - 1) / duration());
    }
  },
};

let player;
player = hy(dhtml`
  ${() => showing() && (player = dhtml`
    <player-x ...${props}>
      <plx-media></plx-media>
      <plx-preview src=${src} />
    <//>
  `)}
`);

onconnected({ target: player });

hy(dhtml`
  <div class="sources" onclick=${(e) => setSrc(e.target.dataset.src)}>
    ${[...Array(30)].map(() => dhtml`
      <div>
        <b />
        <button class="btn src-btn${darkOnSelect}" />
        <button class="btn src-btn${darkOnSelect}" />
      </div>
    `)}
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
  if (dataSrc) {
    src(dataSrc.includes(',') ? dataSrc.split(',') : dataSrc);
  }
}

function darkOnSelect() {
  return src() === this.el.dataset.src ? ' btn-active' : '';
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
    <button onclick=${() => player.set('playbackRate', 0.5)} />
    <button onclick=${() => player.set('playbackRate', 1)} />
    <button onclick=${() => player.set('playbackRate', 2)} />
  </div>
`);

hy(dhtml`
  <input id="current-time-range"
    value=${() => (currentTimeValue() / duration()) || 0}
    oninput=${e => currentTime(e.target.value * duration())} />
`);

hy(dhtml`
  <input id="volume-range"
    value=${() => volumeValue() || 0}
    oninput=${e => volume(e.target.value)} />
`);

hy(dhtml`
  <div class="state-values">
    <b /><i>${() => String(!playing())}</i>
    <b /><i>${() => round(volumeValue(), 2)}</i>
    <b /><i>${() => round(buffered(), 2)}</i>
    <b /><i>${() => toHHMMSS(duration())}</i>
    <b /><i>${() => toHHMMSS(currentTimeValue())}</i>
    <b /><i>${() => String(ended())}</i>
  </div>
`);

hy(dhtml`
  <input id="autoplay" oninput=${e => autoplay(e.target.checked)} checked=${autoplay} />
`);

hy(dhtml`
  <input id="muted" oninput=${e => muted(e.target.checked)} checked=${muted} />
`);

hy(dhtml`
  <input id="loop" oninput=${e => loop(e.target.checked)} checked=${loop} />
`);

hy(dhtml`
  <input id="controls" oninput=${e =>
    controls(e.target.checked)} checked=${controls} />
`);

export {
  defaults,
  autoplay,
  muted,
  controls,
  loop,
  src,
};

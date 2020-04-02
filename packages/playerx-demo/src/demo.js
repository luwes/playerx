import { observable, html } from 'sinuous';
import { dhtml, hydrate } from 'sinuous/hydrate';
import { toHHMMSS, round } from './utils.js';

let src = observable('https://vimeo.com/357274789');
// let src = observable('https://soundcloud.com/areckoner/winter-fingers');
// let src = observable('https://wesleyluyten.wistia.com/medias/dgzftn5ctz');
// let src = observable('https://www.youtube.com/watch?v=BK1JIjLPwaA');
// let src = observable('https://streamable.com/aizxh');
// let src = observable('https://www.facebook.com/wesleyluyten/videos/10220940465559072');
let playing = observable(false);
let volume = observable(1);
let volumeValue = observable(1);
let buffered = observable(0);
let duration = observable(0);
let currentTime = observable(0);
let currentTimeValue = observable(0);
let ended = observable(false);
let muted = observable(true);
let loop = observable(true);
let controls = observable(true);

const props = {
  src,
  playing,
  muted,
  loop,
  controls,
  currentTime,
  volume,
  onpause: () => playing(false),
  onplay: () => playing(true),
  onplaying: () => playing(true),
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

const player = hydrate(dhtml`
  <player-x ...${props} />
`);

hydrate(dhtml`
  <div class="sources" onclick=${e => src(e.target.dataset.src)} />
`);

hydrate(dhtml`
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

  player.remove();
  document.querySelector('#player').append(html`
    <player-x ...${props} />
  `);
}

hydrate(dhtml`
  <div id="controls-2">
    <span />
    <button onclick=${() => player.set('playbackRate', 0.5)} />
    <button onclick=${() => player.set('playbackRate', 1)} />
    <button onclick=${() => player.set('playbackRate', 2)} />
  </div>
`);

hydrate(dhtml`
  <input id="current-time-range"
    value=${() => (currentTimeValue() / duration()) || 0}
    oninput=${e => currentTime(e.target.value * duration())} />
`);

hydrate(dhtml`
  <input id="volume-range"
    value=${() => volumeValue() || 0}
    oninput=${e => volume(e.target.value)} />
`);

hydrate(dhtml`
  <input id="muted" oninput=${e => muted(e.target.checked)} checked=${muted} />
`);

hydrate(dhtml`
  <input id="loop" oninput=${e => loop(e.target.checked)} checked=${loop} />
`);

hydrate(dhtml`
  <input id="controls" oninput=${e =>
    controls(e.target.checked)} checked=${controls} />
`);

hydrate(dhtml`
  <div class="state-values">
    <b /><i>${src}</i>
    <b /><i>${() => String(!playing())}</i>
    <b /><i>${() => round(volumeValue(), 2)}</i>
    <b /><i>${() => round(buffered(), 2)}</i>
    <b /><i>${() => toHHMMSS(duration())}</i>
    <b /><i>${() => toHHMMSS(currentTimeValue())}</i>
    <b /><i>${() => String(ended())}</i>
  </div>
`);

async function initState() {
  await player.ready();

  if (player.volume != null) volumeValue(player.volume);
  if (player.duration) duration(player.duration);
}

initState();

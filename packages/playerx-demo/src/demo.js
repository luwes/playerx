import { observable } from 'sinuous';
import { dhtml, hydrate as hy } from 'sinuous/hydrate';
import { toHHMMSS, round, computedValue } from './utils.js';

let src = observable('https://share.vidyard.com/watch/TYY9iSji3mJuFqp2oj4FoL?');
// let src = observable('https://vimeo.com/357274789');
// let src = observable('https://www.dailymotion.com/video/x7sgamf');
// let src = observable('https://soundcloud.com/areckoner/winter-fingers');
// let src = observable('https://wesleyluyten.wistia.com/medias/dgzftn5ctz');
// let src = observable('https://www.youtube.com/watch?v=BK1JIjLPwaA');
// let src = observable('https://streamable.com/aizxh');
// let src = observable('https://www.facebook.com/wesleyluyten/videos/10220940465559072');

let showing = computedValue(() => !!src());
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
  onpause: observable(() => playing(false)),
  onplay: observable(() => playing(true)),
  onplaying: observable(() => playing(true)),
  onended: observable(() => playing(false)),
  ondurationchange: observable(() =>
    player.duration && duration(player.duration)),
  onseeking: observable(() => currentTimeValue(player.currentTime)),
  onseeked: observable(() => currentTimeValue(player.currentTime)),
  ontimeupdate: observable(() => {
    currentTimeValue(player.currentTime);
    ended(player.ended);
  }),
  onvolumechange: observable(() => {
    volumeValue(player.volume);
    muted(player.muted);
  }),
  onprogress: observable(() => {
    const len = player.buffered.length;
    if (len && duration()) {
      buffered(player.buffered.end(len - 1) / duration());
    }
  }),
};

let player = hy(dhtml`
  ${() => showing() && (player = dhtml`<player-x ...${props} />`)}
`);

function remove() {
  playing(false);
  src('');
}

hy(dhtml`
  <div class="sources" onclick=${e => {
    if (e.target.dataset.src) src(e.target.dataset.src);
  }} />
`);

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

hy(dhtml`
  <div id="controls-2">
    <span />
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
  <input id="muted" oninput=${e => muted(e.target.checked)} checked=${muted} />
`);

hy(dhtml`
  <input id="loop" oninput=${e => loop(e.target.checked)} checked=${loop} />
`);

hy(dhtml`
  <input id="controls" oninput=${e =>
    controls(e.target.checked)} checked=${controls} />
`);

hy(dhtml`
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

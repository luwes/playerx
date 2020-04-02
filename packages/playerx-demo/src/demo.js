import { observable } from 'sinuous';
import { dhtml, hydrate } from 'sinuous/hydrate';
import { toHHMMSS, round } from './utils.js';

let src = observable();
let playing = observable(false);
let paused = observable(true);
let volume = observable(0);
let duration = observable(0);

const props = {
  src,
  playing,
  onplay: () => paused(false),
  onpause: () => paused(true),
  onvolumechange: (e) => volume(e.detail.volume)
};

const player = hydrate(dhtml`
  <player-x ...${props} />
`);

hydrate(dhtml`
  <div class="sources" onclick=${(e) => src(e.target.dataset.src)} />
`);

hydrate(dhtml`
  <div class="controls-1">
    <button onclick=${() => playing(paused())}>
      ${() => paused() ? 'Play' : 'Pause'}
    </button>
    <button onclick=${() => player.stop()} />
  </div>
`);

hydrate(dhtml`
  <div class="state-values">
    <b /><i>${src}</i>
    <b /><i>${() => String(paused())}</i>
    <b /><i>${() => round(volume(), 2)}</i>
    <b /><i>${() => toHHMMSS(duration())}</i>
  </div>
`);

async function initState() {
  volume(await player.getVolume());
  duration(await player.getDuration());
}

initState();

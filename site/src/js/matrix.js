import { observable, computed, subscribe } from 'sinuous/observable';
import { dhtml, hydrate as hy } from 'sinuous/hydrate';

const clip = observable(1);
const playing = observable(false);
const duration = observable(0);
const currentTime = observable(0);
const currentTimeValue = observable(0);

let src = function () {
  const { el } = this;
  return computed(() => {
    return el.dataset[`clip${clip()}`];
  });
};

let clipClass = function () {
  const { el } = this;
  return computed(() => {
    const active = clip()+'' === el.dataset.clip ? 'btn-active' : '';
    return `btn btn-clip${el.dataset.clip} ${active}`;
  });
};

hy(dhtml`
  <div id="controls-1">
    <button class=${clipClass} onclick=${() => clip(1)} />
    <button class=${clipClass} onclick=${() => clip(2)} />
    <button onclick=${() => playing(!playing())}>
      ${() => (playing() ? 'Pause' : 'Play')}
    </button>
    <button onclick=${() => currentTime(0)} />
  </div>
`);

hy(dhtml`
  <input id="current-time-range"
    value=${() => currentTimeValue() / duration() || 0}
    oninput=${(e) => currentTime(e.target.value * duration())} />
`);

const props = {
  src,
  currentTime,
  ondurationchange: () => player.duration && duration(player.duration),
  onseeking: () => currentTimeValue(player.currentTime),
  onseeked: () => currentTimeValue(player.currentTime),
  ontimeupdate: throttle(() => {
    currentTimeValue(player.currentTime);
  }, 500),
  style: '--controls: none;'
};

let gridColsClass = observable('grid-cols-4');
let players = hy(dhtml`
  <div id="players" class="md:grid ${gridColsClass}">
    ${[...Array(30)].map(
      () => dhtml`
      <div>
        <player-x ...${props}></player-x>
      </div>
    `
    )}
  </div>
`);

let player = players.querySelector('player-x');

subscribe(() => {
  const isPaused = !playing();
  for (let p of players.querySelectorAll('player-x')) {
    if (p.paused !== isPaused) {
      !isPaused ? p.play() : p.pause();
    }
  }
});

let underlineClass = function () {
  const { el } = this;
  return computed(() => {
    const underline = gridColsClass() === `grid-cols-${el.textContent}`;
    return `grid-btn ${underline ? 'underline' : ''}`;
  });
};

hy(dhtml`
  <div id="grid-btns">
    ${[...Array(4)].map(
      () => dhtml`<button class="${underlineClass}" onclick=${(e) => {
        gridColsClass(`grid-cols-${e.currentTarget.textContent}`);
      }} />`
    )}
  </div>
`);


function throttle(func, timeFrame) {
  var lastTime = 0;
  return function () {
      var now = new Date();
      if (now - lastTime >= timeFrame) {
          func();
          lastTime = now;
      }
  };
}

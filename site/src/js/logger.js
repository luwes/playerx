/* global playerx */
import { observe } from 'disco';
import { html } from 'sinuous';
import { observable, computed } from 'sinuous/observable';
import { map } from 'sinuous/map';
import { dhtml, hydrate as hy, _ } from 'sinuous/hydrate';
import { round } from './utils/utils.js';

const Events = {
  CUECHANGE: 'cuechange',
  DURATIONCHANGE: 'durationchange',
  ENDED: 'ended',
  ERROR: 'error',
  LOADEDMETADATA: 'loadedmetadata',
  LOADSTART: 'loadstart',
  PAUSE: 'pause',
  PLAY: 'play',
  PLAYING: 'playing',
  PROGRESS: 'progress',
  RATECHANGE: 'ratechange',
  RESIZE: 'resize',
  SEEKED: 'seeked',
  SEEKING: 'seeking',
  TIMEUPDATE: 'timeupdate',
  VOLUMECHANGE: 'volumechange',
}

observe('player-x');

const playerStartupTime = observable('0');
const videoStartupTime = observable('0');

const eventData = {
  loadstart: (player) => player.src,
  error: ({ error }) => {
    console.error(error);
    return error && (error.message || error.code || error);
  },
  resize: (player) => `${player.videoWidth}x${player.videoHeight}`,
  volumechange: (player) => `${round(player.volume, 2)}`,
  durationchange: (player) => `${round(player.duration, 2)}s`,
  ratechange: (player) => `${round(player.playbackRate, 1)}`,
  timeupdate: (player) => `${round(player.currentTime, 2)}s`,
  progress: (player) => {
    if (player.buffered && player.buffered.length && player.duration) {
      const buffered = player.buffered.end(player.buffered.length - 1);
      return `${Math.round(buffered / player.duration * 100)}%`;
    }
  },
};

const logs = observable([]);
const logger = hy(dhtml`
  <div id="logger">
    ${() => map(
      logs,
      ({ type, target, elapsed }) => html`
        <div class="log">
          <div>${type} event${getEventData({ type, target })}</div>
          <i>${formatTime(elapsed)}s</i>
        </div>`
      )}
  </div>
`);

function getEventData({ type, target }) {
  if (eventData[type]) {
    return html` <span class="bg-orange-100">${eventData[type](target)}</span>`;
  }
}

const playerStartupClass = computed(() => {
  return playerStartupTime() === '0' ? 'pill' : 'pill pill-on';
});

const videoStartupClass = computed(() => {
  return videoStartupTime() === '0' ? 'pill' : 'pill pill-on';
});

hy(dhtml`
  <div id="info-pills">
    <p class=${playerStartupClass}>${_}<i>${() => formatTime(playerStartupTime())}s</i></p>
    <p class=${videoStartupClass}>${_}<i>${() => formatTime(videoStartupTime())}s</i></p>
  </div>`
);

function formatTime(time) {
  return (time / 1000).toFixed(1);
}

export function onconnected({ target: player }) {
  if (player) {
    player.addEventListener('loadstart', onloadstart);
    player.addEventListener('loadedmetadata', onloadedmetadata);
    player.addEventListener('play', onplay);
    player.addEventListener('playing', onplaying);

    for (let event in Events) {
      player.addEventListener(Events[event], log);
    }
  }
}

export function ondisconnected() {
  console.log('DISCONNECTED');
}

let startTime;
let videoStartTime;
let playerStartupAnim;
let videoStartupAnim;
let firstPlayEvent;
let firstPlayingEvent;

function playerStartupStep() {
  playerStartupTime(performance.now() - startTime);
  playerStartupAnim = requestAnimationFrame(playerStartupStep);
}

function videoStartupStep() {
  videoStartupTime(performance.now() - videoStartTime);
  videoStartupAnim = requestAnimationFrame(videoStartupStep);
}

function onloadstart() {
  startTime = performance.now();
  playerStartupAnim = requestAnimationFrame(playerStartupStep);

  videoStartupTime('0');

  firstPlayEvent = true;
  firstPlayingEvent = true;
}

function onloadedmetadata() {
  cancelAnimationFrame(playerStartupAnim);
  playerStartupTime(performance.now() - startTime);

  videoStartTime = performance.now();
}

function onplay() {
  if (!firstPlayEvent) return;
  firstPlayEvent = false;

  videoStartTime = performance.now();
  videoStartupAnim = requestAnimationFrame(videoStartupStep);
}

function onplaying() {
  if (!firstPlayingEvent) return;
  firstPlayingEvent = false;

  cancelAnimationFrame(videoStartupAnim);
  videoStartupTime(performance.now() - videoStartTime);
}

function log(e) {
  if (e.type === 'loadstart') {
    logs([]);
  }

  e.elapsed = performance.now() - startTime;

  const prevLogs = logs();
  if (prevLogs.length > 100) prevLogs.shift();
  logs([...prevLogs, e]);

  const isScrolledToEnd = logger.scrollTop >= logger.scrollHeight - logger.offsetHeight - 25;
  if (isScrolledToEnd) {
    logger.scrollTop = logger.scrollHeight;
  }
}

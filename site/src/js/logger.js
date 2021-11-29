/* global playerx */
import { observe } from 'disco';
import { html } from 'sinuous';
import { observable, computed } from 'sinuous/observable';
import { map } from 'sinuous/map';
import { dhtml, hydrate as hy, _ } from 'sinuous/hydrate';
import { round } from './utils/utils.js';

observe('player-x');

const playerStartupTime = observable('0');
const videoStartupTime = observable('0');

const eventData = {
  loadsrc: (player) => player.src,
  error: ({ error }) => {
    console.error(error);
    return error && (error.message || error.code || error);
  },
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
          <i>${round(elapsed / 1000, 1)}s</i>
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
    for (let event in playerx.Events) {
      player.addEventListener(playerx.Events[event], log);
    }
    player.addEventListener('loadedsrc', onloadedsrc);
    player.addEventListener('playing', onplaying);
  }
}

export function ondisconnected() {
  console.log('DISCONNECTED');
}

let startTime;
let videoStartTime;
let playerStartupAnim;
let videoStartupAnim;
let firstPlayingEvent;

function playerStartupStep() {
  playerStartupTime(performance.now() - startTime);
  playerStartupAnim = requestAnimationFrame(playerStartupStep);
}

function videoStartupStep() {
  videoStartupTime(performance.now() - videoStartTime);
  videoStartupAnim = requestAnimationFrame(videoStartupStep);
}

function onloadedsrc() {
  cancelAnimationFrame(playerStartupAnim);
  playerStartupTime(performance.now() - startTime);
}

function onplaying() {
  if (!firstPlayingEvent) return;
  firstPlayingEvent = false;
  cancelAnimationFrame(videoStartupAnim);
  videoStartupTime(performance.now() - videoStartTime);
}

function log(e) {
  if (e.type === 'loadsrc') {
    logs([]);
    startTime = performance.now();
    playerStartupAnim = requestAnimationFrame(playerStartupStep);
    videoStartTime = 0;
    videoStartupTime('0');
    firstPlayingEvent = true;
  } else if (e.type === 'play' && !videoStartTime) {
    videoStartTime = performance.now();
    videoStartupAnim = requestAnimationFrame(videoStartupStep);
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

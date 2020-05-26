/* global playerx */
import { observe } from 'disco';
import { html } from 'sinuous';
import { observable } from 'sinuous/observable';
import { map } from 'sinuous/map/mini';
import { dhtml, hydrate as hy } from 'sinuous/hydrate';
import { round } from './utils/utils.js';

observe('player-x');

const eventData = {
  loadsrc: (player) => player.src,
  error: (player) => player.error.message || player.error.code,
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
      ({ type, target }) => html`
        <p class="truncate">
          ${type} event${getEventData({ type, target })}
        </p>`
      )}
  </div>
`);

function getEventData({ type, target }) {
  if (eventData[type]) {
    return html` <span class="bg-orange-100">${eventData[type](target)}</span>`;
  }
}

export function onconnected({ target: player }) {
  if (player) {
    for (let event in playerx.Events) {
      player.addEventListener(playerx.Events[event], log);
    }
  }
}

export function ondisconnected() {
  console.log('DISCONNECTED');
}

function log(e) {
  if (e.type === 'loadsrc') logs([]);

  const prevLogs = logs();
  if (prevLogs.length > 100) prevLogs.shift();
  logs([...prevLogs, e]);

  logger.scrollTop = logger.scrollHeight;
}

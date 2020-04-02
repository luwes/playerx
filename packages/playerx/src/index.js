import { observedAttributes } from './defaults.js';
import * as players from './players/index.js';
import { playerx } from './playerx.js';
import { define } from './utils/define.js';

function findActivePlayer(instance, props) {
  for (let key in players) {
    if (players[key].canPlay(props.src)) {
      return players[key](instance, props);
    }
  }
}

export default define('player-x', (...args) => playerx(findActivePlayer, ...args), observedAttributes);

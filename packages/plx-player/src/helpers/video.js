
import { promisify } from '../utils/promise.js';

export function createPlayPromise(player) {
  return promisify((event, cb) => {
    let fn;
    player.on(event, (fn = () => {
      player.off(event, fn);
      cb();
    }));
  })('playing');
}

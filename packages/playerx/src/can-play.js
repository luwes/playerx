import * as MATCH_SRC from './constants/src-regex.js';
import {
  AUDIO_EXTENSIONS,
  VIDEO_EXTENSIONS,
  HLS_EXTENSIONS,
  DASH_EXTENSIONS,
} from './constants/src-regex.js';

/**
 * Returns true if a file source can be played.
 * @param  {string} src
 * @return {boolean}
 */
const file = (src) => {
  if (Array.isArray(src)) {
    for (const item of src) {
      if (typeof item === 'string' && file(item)) {
        return true;
      }
      if (file(item.src)) {
        return true;
      }
    }
    return false;
  }
  return (
    AUDIO_EXTENSIONS.test(src) ||
    VIDEO_EXTENSIONS.test(src) ||
    HLS_EXTENSIONS.test(src) ||
    DASH_EXTENSIONS.test(src)
  );
};

export const canPlay = { file };
Object.keys(MATCH_SRC).forEach((player) => {
  canPlay[player] = (src) => MATCH_SRC[player].test(src);
});

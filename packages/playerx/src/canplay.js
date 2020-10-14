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
export const file = (src) => {
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

export const brightcove = (src) => MATCH_SRC.brightcove.test(src);
export const dailymotion = (src) => MATCH_SRC.dailymotion.test(src);
export const facebook = (src) => MATCH_SRC.facebook.test(src);
export const jwplayer = (src) => MATCH_SRC.jwplayer.test(src);
export const soundcloud = (src) => MATCH_SRC.soundcloud.test(src);
export const streamable = (src) => MATCH_SRC.streamable.test(src);
export const twitch = (src) => MATCH_SRC.twitch.test(src);
export const vidyard = (src) => MATCH_SRC.vidyard.test(src);
export const vimeo = (src) => MATCH_SRC.vimeo.test(src);
export const wistia = (src) => MATCH_SRC.wistia.test(src);
export const youtube = (src) => MATCH_SRC.youtube.test(src);

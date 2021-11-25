import * as MATCH_SRC from './constants/src-regex.js';
import {
  AUDIO_EXTENSIONS,
  VIDEO_EXTENSIONS
} from './constants/src-regex.js';

/**
 * Returns true if a file source can be played.
 * @param  {string} src
 * @return {boolean}
 */
export const html = (src) => {
  if (Array.isArray(src)) {
    for (const item of src) {
      if (typeof item === 'string' && html(item)) {
        return true;
      }
      if (html(item.src)) {
        return true;
      }
    }
    return false;
  }
  return (
    AUDIO_EXTENSIONS.test(src) ||
    VIDEO_EXTENSIONS.test(src)
  );
};

export const apivideo = (src) => MATCH_SRC.apivideo.test(src);
export const bitmovin = (src) => MATCH_SRC.bitmovin.test(src);
export const brightcove = (src) => MATCH_SRC.brightcove.test(src);
export const cloudflare = (src) => MATCH_SRC.cloudflare.test(src);
export const dailymotion = (src) => MATCH_SRC.dailymotion.test(src);
export const dashjs = (src) => MATCH_SRC.DASH_EXTENSIONS.test(src);
export const facebook = (src) => MATCH_SRC.facebook.test(src);
export const hlsjs = (src) => MATCH_SRC.HLS_EXTENSIONS.test(src);
export const jwplayer = (src) => MATCH_SRC.jwplayer.test(src);
export const muxvideo = (src) => MATCH_SRC.muxvideo.test(src);
export const shakaplayer = (src) => MATCH_SRC.shakaplayer.test(src);
export const soundcloud = (src) => MATCH_SRC.soundcloud.test(src);
export const streamable = (src) => MATCH_SRC.streamable.test(src);
export const theoplayer = (src) => MATCH_SRC.theoplayer.test(src);
export const twitch = (src) => MATCH_SRC.twitch.test(src);
export const videojs = (src) => MATCH_SRC.videojs.test(src);
export const vidyard = (src) => MATCH_SRC.vidyard.test(src);
export const vimeo = (src) => MATCH_SRC.vimeo.test(src);
export const wistia = (src) => MATCH_SRC.wistia.test(src);
export const youtube = (src) => MATCH_SRC.youtube.test(src);

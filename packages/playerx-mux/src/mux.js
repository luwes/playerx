// https://docs.mux.com/docs/javascript-building-a-custom-integration

import muxData from 'mux-embed';
import { VideoEvents, version } from 'playerx';
import { findSrcFile } from './helpers.js';
import { uniqueId, camelCase, publicPromise, getMimeType } from './utils.js';

export const mux = (options) => () => (player) => {
  let currentPlayer = player.name;
  let playerId;
  let initTime;
  let init;

  player.addEventListener('loadsrc', onloadsrc);
  player.addEventListener('loadedsrc', onloadedsrc);
  player.addEventListener('ready', onready);

  Object.keys(VideoEvents).forEach(key => {
    const event = VideoEvents[key];
    player.addEventListener(event, async () => {
      await init;
      emit(playerId, event);
    });
  });

  function emit(...args) {
    try {
      muxData.emit(...args);
    } catch (error) {
      console.error(error);
    }
  }

  function onloadsrc() {
    init = publicPromise();
    initTime = muxData.utils.now();
  }

  async function onloadedsrc() {
    if (currentPlayer === player.name) {
      emit(playerId, 'videochange', await getVideoData());
    } else {
      playerId = uniqueId('player');
      muxData.init(playerId, {
        debug: true,
        minimumRebufferDuration: 350,
        data: {
          ...options,
          player_init_time: initTime,
          player_name: 'playerx',
          player_version: version,
          player_software_name: player.name.toLowerCase(),
          player_software_version: player.version,
          player_mux_plugin_name: 'playerx-mux',
          player_mux_plugin_version: '0.0.1',
          page_type: player.querySelectorAll('iframe').length && 'iframe',
          ...(await getVideoData()),
        },
        getPlayheadTime,
        getStateData,
      });
    }

    currentPlayer = player.name;
    init.resolve();
  }

  async function getVideoData() {
    const keys = [
      'id',
      'title',
      'series',
      'variant_name',
      'variant_id',
      'language_code',
      'content_type',
      'stream_type',
      'producer',
      'encoding_variant',
      'cdn',
    ];

    const videoData = {};
    videoData.video_duration = (await player.get('duration')) * 1000;

    await Promise.all(keys.map(async key => {
      const prop = `video_${key}`;
      videoData[prop] = await player.get(camelCase(prop));
    }));

    Object.keys(videoData).forEach(prop => {
      if (videoData[prop] == null) {
        // console.warn(`${prop} video data missing!`);
        delete videoData[prop];
      }
    });

    return videoData;
  }

  async function onready() {
    await init;
    emit(playerId, 'playerready');
  }

  function getPlayheadTime() {
    if (player.api) {
      return player.currentTime;
    }
  }

  function getStateData() {
    const stateData = {
      // Required properties - these must be provided every time this is called
      // You _should_ only provide these values if they are defined (i.e. not 'undefined')
      player_is_paused: player.paused, // Return whether the player is paused, stopped, or complete (i.e. in any state that is not actively trying to play back the video)
      player_width: player.clientWidth, // Return the width, in pixels, of the player on screen
      player_height: player.clientHeight, // Return the height, in pixels, of the player on screen
      video_source_height: player.videoHeight, // Return the height, in pixels, of the current rendition playing in the player
      video_source_width: player.videoWidth, // Return the height, in pixels, of the current rendition playing in the player

      // Preferred properties - these should be provided in this callback if possible
      // If any are missing, that is okay, but this will be a lack of data for the customer at a later time
      player_is_fullscreen: player.contains(document.fullscreenElement), // Return true if the player is fullscreen
      player_autoplay_on: player.autoplay, // Return true if the player is autoplay
      player_preload_on: player.preload && player.preload !== 'none', // Return true if the player is preloading data (metadata, on, auto are all "true")
      video_source_url: findSrcFile(player), // Return the playback URL (i.e. URL to master manifest or MP4 file)
      video_source_mime_type: getMimeType(findSrcFile(player)), // Return the mime type (if possible), otherwise the source type (hls, dash, mp4, flv, etc)
      video_source_duration: player.duration * 1000, // Return the duration of the source as reported by the player (could be different than is reported by the customer)

      // Optional properties - if you have them, send them, but if not, no big deal
      video_poster_url: player.poster, // Return the URL of the poster image used
      player_language_code: player.lang || document.documentElement.lang // Return the language code (e.g. `en`, `en-us`)
    };

    Object.keys(stateData).forEach(prop => {
      if (typeof stateData[prop] !== 'boolean' && !stateData[prop]) {
        // console.warn(`${prop} video data missing!`);
        delete stateData[prop];
      }
    });

    return stateData;
  }
};

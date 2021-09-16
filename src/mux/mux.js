// https://docs.mux.com/docs/javascript-building-a-custom-integration
import pkg from '../../package.json';
import muxData from 'mux-embed';
import { VideoEvents, version } from 'playerx';
import { findSrcFile } from './helpers.js';
import {
  uniqueId,
  publicPromise,
  getMimeType,
  camelToSnakeKeys,
  camelCase,
  defineCustomElement,
  findAncestor,
} from './utils.js';

/** @typedef { import('./index').PlxMux } PlxMux */

export class PlxMux extends HTMLElement {
  static get observedAttributes() {
    return ['debug'];
  }

  get player() {
    if (this.hasAttribute('player')) {
      return document.querySelector(`#${this.getAttribute('player')}`);
    }
    return findAncestor(this, 'player-x');
  }

  get debug() {
    return this.getAttribute('debug') != null;
  }

  set debug(value) {
    this.setAttribute('debug', value);
  }

  constructor() {
    super();
    this._init();
  }

  connectedCallback() {
    this._init();
  }

  _init() {
    if (this._isInit || !this.player) return;
    this._isInit = true;

    this._currentPlayer = this.player.name;

    this.player.addEventListener('loadsrc', this.onloadsrc.bind(this));
    this.player.addEventListener('loadedsrc', this.onloadedsrc.bind(this));
    this.player.addEventListener('ready', this.onready.bind(this));

    Object.keys(VideoEvents).forEach((key) => {
      const event = VideoEvents[key];
      this.player.addEventListener(event, async () => {
        await this._readyPromise;
        this.emit(this._playerId, event);
      });
    });
  }

  emit(...args) {
    try {
      muxData.emit(...args);
    } catch (error) {
      console.error(error);
    }
  }

  async onready() {
    await this._readyPromise;
    this.emit(this._playerId, 'playerready');
  }

  onloadsrc() {
    this._readyPromise = publicPromise();
    this._initTime = muxData.utils.now();
  }

  async onloadedsrc() {
    const { player } = this;
    await player.ready();

    if (this._currentPlayer === player.name) {
      this.emit(this._playerId, 'videochange', {
        ...(await getConfigurableMetadata(this.player)),
        ...camelToSnakeKeys(this.dataset),
      });
    } else {
      this._playerId = uniqueId('player');
      muxData.init(this._playerId, {
        debug: this.debug,
        minimumRebufferDuration: 350,
        data: {
          player_init_time: this._initTime,
          player_name: 'playerx',
          player_version: version,
          player_software_name: player.key,
          player_software_version: player.version,
          player_mux_plugin_name: 'playerx-mux',
          player_mux_plugin_version: pkg.version,
          page_type: player.querySelectorAll('iframe').length && 'iframe',
          ...(await getConfigurableMetadata(this.player)),
          ...camelToSnakeKeys(this.dataset),
        },
        getPlayheadTime: () => getPlayheadTime(this.player),
        getStateData: () => getStateData(this.player),
      });
    }

    this._currentPlayer = player.name;
    this._readyPromise.resolve();
  }
}

defineCustomElement('plx-mux', PlxMux);

function getPlayheadTime(player) {
  if (player.api) {
    return player.currentTime;
  }
}

function getStateData(player) {
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
    player_language_code: player.lang || document.documentElement.lang, // Return the language code (e.g. `en`, `en-us`)
  };

  Object.keys(stateData).forEach((prop) => {
    if (typeof stateData[prop] !== 'boolean' && !stateData[prop]) {
      // console.warn(`${prop} video data missing!`);
      delete stateData[prop];
    }
  });

  return stateData;
}

async function getConfigurableMetadata(player) {
  const keys = [
    'experiment_name',
    'page_type',
    'sub_property_id',
    'video_cdn',
    'video_content_type',
    'video_encoding_variant',
    'video_id',
    'video_language_code',
    'video_producer',
    'video_series',
    'video_stream_type',
    'video_title',
    'video_variant_id',
    'video_variant_name',
    'view_session_id',
    'viewer_user_id',
  ];

  const videoData = {};

  const duration = await player.get('duration');
  if (duration > 0) {
    videoData.video_duration = duration * 1000; // in milliseconds
  }

  const metadata = await player.get('meta');
  videoData.video_title = metadata.name;
  videoData.video_id = metadata.identifier;

  keys.forEach((key) => {
    if (videoData[key] != null) return;
    videoData[key] = metadata[key];
    if (videoData[key] != null) return;
    videoData[key] = metadata[camelCase(key)];
  });

  Object.keys(videoData).forEach((prop) => {
    if (videoData[prop] == null) {
      // console.warn(`${prop} video data missing!`);
      delete videoData[prop];
    }
  });

  return videoData;
}

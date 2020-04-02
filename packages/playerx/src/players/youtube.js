import { observedAttributes } from '../defaults.js';
import { playerx, coreMethodNames } from '../playerx.js';
import { createEmbedIframe, createResponsiveStyle, getName, setName } from '../helpers/index.js';
import { assign, define, loadScript, pick, bindAll, publicPromise, serialize } from '../utils/index.js';

const EMBED_BASE = 'https://www.youtube.com/embed';
const API_URL = 'https://www.youtube.com/iframe_api';
const API_GLOBAL = 'YT';
const API_GLOBAL_READY = 'onYouTubeIframeAPIReady';
const MATCH_URL = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/;

youtube.canPlay = src => MATCH_URL.test(src);

export function youtube(element, props) {
  let instance = { f: youtube };
  let player;
  let iframe;
  let ready = publicPromise();
  let styleMethods = createResponsiveStyle(props);

  async function init() {
    const videoId = props.src.match(MATCH_URL)[1];
    const options = {
      autoplay: props.autoplay ? 1 : 0,
      muted: props.muted ? 1 : 0,
      loop: props.loop ? 1 : 0,
      playsinline: props.playsinline ? 1 : 0,
      controls: props.controls ? 1 : 0,
      origin: location.origin,
      enablejsapi: 1
    };
    const src = `${EMBED_BASE}/${videoId}?${serialize(options)}`;
    iframe = createEmbedIframe({ src });

    const YT = await loadScript(API_URL, API_GLOBAL, API_GLOBAL_READY);
    player = new YT.Player(iframe, {
      events: {
        onReady: ready._resolve
      }
    });

    const playerBound = bindAll(coreMethodNames, player);
    const playerMethods = pick(coreMethodNames, playerBound);
    assign(instance, playerMethods, methods);
  }

  const methods = {

    get _element() {
      return iframe;
    },

    ready() {
      return ready;
    },

    set(name, value) {
      return instance[setName(name)](value);
    },

    get(name) {
      return instance[getName(name)]();
    },

    async setSrc() {
    },

    stop() {
      return player.stopVideo();
    },

  };

  init();

  return assign(instance, styleMethods, methods);
}

export default define('player-youtube', (...args) => playerx(youtube, ...args), observedAttributes);

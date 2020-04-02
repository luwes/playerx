import { observedAttributes } from '../defaults.js';
import { playerx, coreMethodNames } from '../playerx.js';
import { createEmbedIframe, createResponsiveStyle, getName, setName } from '../helpers/index.js';
import { assign, define, loadScript, pick, bindAll, publicPromise, serialize } from '../utils/index.js';

const EMBED_BASE = 'https://player.vimeo.com/video';
const API_URL = 'https://player.vimeo.com/api/player.js';
const API_GLOBAL = 'Vimeo';
const MATCH_URL = /vimeo\.com\/(?:video\/)?(\d+)/;

vimeo.canPlay = src => MATCH_URL.test(src);

export function vimeo(element, props) {
  let instance = { f: vimeo };
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
    };
    const src = `${EMBED_BASE}/${videoId}?${serialize(options)}`;
    iframe = createEmbedIframe({ src });

    const Vimeo = await loadScript(API_URL, API_GLOBAL);
    player = new Vimeo.Player(iframe);
    ready._resolve(player.ready());

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

    async setSrc(src) {
      const videoId = src.match(MATCH_URL)[1];
      return player.loadVideo(videoId);
    },

    stop() {
      return player.unload();
    },

  };

  init();

  return assign(instance, styleMethods, methods);
}

export default define('player-vimeo', (...args) => playerx(vimeo, ...args), observedAttributes);

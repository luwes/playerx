import './_polyfills.js';

import './error.js';
import './methods.js';
import './helpers.js';
import './can-play.js';
import './utils.js';

// Run the buggy players first
import './players/dailymotion.js';
import './players/youtube.js';
import './players/streamable.js';
import './players/soundcloud.js';
import './players/facebook.js';
import './players/twitch.js';

import './players/file-dash.js';
import './players/file-hls.js';
import './players/file-progressive.js';
import './players/brightcove.js';
import './players/jwplayer.js';
import './players/vidyard.js';
import './players/vimeo.js';
import './players/wistia.js';

import './error.js';
import './methods.js';
import './helpers.js';
import './can-play.js';
import './utils.js';

import '../src/all.js';

// Run the buggy players first
import './players/facebook.js';
import './players/dailymotion.js';
import './players/youtube.js';
import './players/wistia.js';
// import './players/twitch.js'; // too buggy, timeouts on play test
import './players/streamable.js';
import './players/soundcloud.js';
import './players/jwplayer.js';
import './players/vidyard.js';
import './players/dashjs.js';
import './players/hlsjs.js';
import './players/html.js';
import './players/brightcove.js';
import './players/vimeo.js';

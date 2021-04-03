import './error.js';
import './methods.js';
import './helpers.js';
import './can-play.js';
import './utils.js';

import '../src/all.js';

// Run the buggy players first
import './players/youtube.js';
import './players/wistia.js';
import './players/dailymotion.js';
// import './players/twitch.js'; // too buggy, timeouts on play test
import './players/streamable.js';
import './players/soundcloud.js';
// import './players/jwplayer.js'; // need jw player developer license
import './players/vidyard.js';
import './players/file-dash.js';
import './players/file-hls.js';
import './players/file-progressive.js';
import './players/brightcove.js';
import './players/vimeo.js';
// Facebook player is not removed properly, test this one last.
import './players/facebook.js';

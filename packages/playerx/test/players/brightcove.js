import { testPlayer } from '../player.js';

const src = 'https://studio.brightcove.com/products/videocloud/media/videos/4883184247001';
const duration = 50;

const ie = true;
// Brightcove throws a media decode error on Saucelabs Safari
const safari = false;

testPlayer({ src }, { duration, ie, safari });

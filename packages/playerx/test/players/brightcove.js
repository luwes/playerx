import { testPlayer } from '../player.js';

const src = 'https://studio.brightcove.com/products/videocloud/media/videos/4883184247001';
const duration = 50;
const ie = true;

testPlayer({ src }, { duration, ie });

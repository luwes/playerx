import { testPlayer } from '../player.js';

const src = 'https://studio.brightcove.com/products/videocloud/media/videos/5755775186001';
const duration = 18;
const ie = true;

testPlayer({ src }, { duration, ie });

import { testPlayer } from '../player.js';

const src = 'https://www.twitch.tv/videos/566280744';
const duration = 45;
const ie = false;

testPlayer({ src }, { duration, ie });

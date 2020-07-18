import { testPlayer } from '../player.js';

const src = 'https://cdn.jwplayer.com/players/Fpw44kH6-IxzuqJ4M.js';
const duration = 46;
const ie = true;

testPlayer({ src }, { duration, ie });

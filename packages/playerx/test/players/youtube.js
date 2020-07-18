import { testPlayer } from '../player.js';

const src = 'https://www.youtube.com/watch?v=BK1JIjLPwaA';
const duration = 46;
const ie = true;

testPlayer({ src }, { duration, ie });

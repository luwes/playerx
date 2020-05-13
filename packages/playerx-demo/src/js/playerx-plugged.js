import * as playerx from 'playerx';
import { lite } from 'playerx-lite';
import { mux } from 'playerx-mux';

playerx.options.plugins.push(lite, mux);

export default playerx;

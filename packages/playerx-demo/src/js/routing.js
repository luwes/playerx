import { on } from 'sinuous/observable';
import { defaults, autoplay, muted, loop, controls, src } from './demo.js';
import { getParams, toQuery } from './utils/url.js';
import { qs } from './utils/utils.js';

on([autoplay, muted, loop, controls, src], () => {

  const btn = qs(`[data-src="${src()}"]`);
  const options = {
    ...getParams(),
    autoplay,
    muted,
    loop,
    controls,
    src: btn ? undefined : src,
  };

  let search = toQuery(options, defaults);
  let url;
  if (btn) {
    url = `/${btn.dataset.player}/${search}`;
  } else {
    url = `/${search}`;
  }

  history.pushState({}, '', url);

}, null, true);

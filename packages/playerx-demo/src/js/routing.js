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
    if (btn.dataset.clip === '1') {
      url = `/demo/${btn.dataset.player}/${search}`;
    } else {
      url = `/demo/${btn.dataset.player}/${btn.dataset.clip}/${search}`;
    }
  } else {
    url = `/demo/${search}`;
  }

  history.pushState({}, '', url);

}, null, true);

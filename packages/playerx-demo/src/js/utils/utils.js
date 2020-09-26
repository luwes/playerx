import { observable, subscribe, sample } from 'sinuous/observable';

export const qs = (selector) => document.querySelector(selector);

export function invert(accessor) {
  return () => accessor(!accessor());
}

export function computedValue(fn) {
  let val = observable(fn());
  subscribe(() => {
    if (sample(val) !== fn()) {
      val(fn());
    }
  });
  return val;
}

export function value(current) {
  const v = observable(current);
  return function (update) {
    if (!arguments.length) return v();
    if (update !== current) {
      current = v(update);
    }
    return update;
  };
}

export function toHHMMSS(secs) {
  const sec_num = parseInt(secs, 10),
    hours = Math.floor(sec_num / 3600),
    minutes = Math.floor(sec_num / 60) % 60,
    seconds = sec_num % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? '0' + v : v))
    .filter((v, i) => v !== '00' || i > 0)
    .join(':');
}

export function round(num, precision) {
  return +(Math.round(num + 'e+' + precision) + 'e-' + precision);
}

export function prettyQuality(height) {
  if (!height) return 'n/a';
  if (height >= 2160) return '4K';
  if (height >= 1440) return '2K';
  return `${height}p`;
}

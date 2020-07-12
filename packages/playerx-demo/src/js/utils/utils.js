import { observable } from 'sinuous/observable';

export const qs = (selector) => document.querySelector(selector);

export function value(current, eq) {
  const v = observable(current);
  return function(update) {
    if (!arguments.length) return v();
    if (!(eq ? eq(update, current) : update === current)) {
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
  const f = 10 ** precision;
  return Math.round((num + Number.EPSILON) * f) / f;
}

export function prettyQuality(height) {
  if (!height) return 'n/a';
  if (height >= 2160) return '4K';
  if (height >= 1440) return '2K';
  return `${height}p`;
}

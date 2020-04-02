export function ready(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

export function invert(accessor) {
  return () => accessor(!accessor());
}

export function toHHMMSS(secs) {
  const sec_num = parseInt(secs, 10),
    hours = Math.floor(sec_num / 3600),
    minutes = Math.floor(sec_num / 60) % 60,
    seconds = sec_num % 60;

  return [hours, minutes, seconds]
    .map(v => (v < 10 ? '0' + v : v))
    .filter((v, i) => v !== '00' || i > 0)
    .join(':');
}

export function round(num, precision) {
  const f = 10 ** precision;
  return Math.round((num + Number.EPSILON) * f) / f;
}

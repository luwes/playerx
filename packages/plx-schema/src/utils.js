export function requestJson(url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open('GET', url);
    req.send();
    req.onload = function () {
      if (req.status >= 200 && req.status < 400 ) {
        resolve(JSON.parse(req.responseText));
        return;
      }
      reject(new Error(req.statusText));
    };
    req.onerror = reject;
  });
}

export function secondsToISOString(seconds) {
  let Y = Math.floor(seconds / 60 / 60 / 24 / 365);
  let M = Math.floor(seconds / 60 / 60 / 24 / 30.42 % 12);
  let D = Math.floor(seconds / 60 / 60 / 24 % 30.42);
  let h = Math.floor(seconds / 60 / 60 % 24);
  let m = Math.floor(seconds / 60 % 60);
  let s = Math.floor(seconds % 60);

  if (!seconds) {
    return 'P0D';
  }

  return (
    (seconds < 0 ? '-' : '') +
    'P' +
    (Y ? Y + 'Y' : '') +
    (M ? M + 'M' : '') +
    (D ? D + 'D' : '') +
    (h || m || s ? 'T' : '') +
    (h ? h + 'H' : '') +
    (m ? m + 'M' : '') +
    (s ? s + 'S' : '')
  );
}

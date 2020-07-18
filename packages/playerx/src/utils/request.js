export function requestJson(url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open('GET', url);
    req.send();
    req.onload = function() {
      resolve(JSON.parse(req.responseText));
    };
    req.onerror = reject;
  });
}

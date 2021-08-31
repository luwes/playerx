export function findSrcFile(player) {
  if (typeof player.src === 'string' && !/^blob:/.test(player.src)) {
    return player.src;
  }

  if (
    typeof player.currentSrc === 'string' &&
    !/^blob:/.test(player.currentSrc) &&
    player.readyState > 0
  ) {
    return player.currentSrc;
  }

  return '';
}

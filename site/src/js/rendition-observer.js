import { observe } from 'disco';

observe('video,mux-video');

document.addEventListener('connected', onconnected, true);

const { getMediaSourceByUrl } = interceptMediaSource();
let segmentDuration;
let lastSegmentSize;

async function onconnected({ target: video }) {
  console.log('CONNECTED', video);

  video.addEventListener('disconnected', ondisconnected);

  if (video.tagName.includes('-')) {
    await customElements.whenDefined(video.tagName.toLowerCase());
  }

  video.addEventListener('loadedmetadata', onloadedmetadata);
  // video.addEventListener('play', onplay);
  video.addEventListener('progress', onprogress);
  video.addEventListener('resize', onresize);
}

async function ondisconnected({ target: video }) {
  console.log('DISCONNECTED', video);

  // video.removeEventListener('play', onplay);
  video.removeEventListener('progress', onprogress);
}

function onloadedmetadata({ target: video }) {
  segmentDuration = undefined;

  const mediaSource = video.srcObject || getMediaSourceByUrl(video.src);
  const sourceBufferList = mediaSource.activeSourceBuffers;
  for (let i = 0; i < sourceBufferList.length; i++) {
    const sourceBuffer = sourceBufferList[i];
    sourceBuffer.addEventListener('updateend', onupdateend);
  }
}

function onupdateend(e) {
  const { target: sourceBuffer } = e;

  if (sourceBuffer.buffered.length === 0 ||
    sourceBuffer.videoTracks.length === 0) return;

  if (!segmentDuration) {
    segmentDuration = sourceBuffer.buffered.end(0);
    console.log('segmentDuration', segmentDuration);
  }

  if (lastSegmentSize < 8e3) return;

  console.log('lastSegmentSize', lastSegmentSize);
  console.log('lastSegmentBitrate', Math.round(lastSegmentSize * 8 / segmentDuration / 1000), 'kbps');
}

async function onresize({ target: video }) {
  console.log(video.videoWidth, video.videoHeight);
}

function interceptMediaSource() {
  const urlToMediaSource = {};

  const createObjectURL = URL.createObjectURL;
  URL.createObjectURL = function(mediaSource) {
    const url = createObjectURL(mediaSource);
    urlToMediaSource[url] = mediaSource;
    return url;
  };

  const addSourceBuffer = MediaSource.prototype.addSourceBuffer;
  MediaSource.prototype.addSourceBuffer = function(mimeType) {
    console.log(mimeType);
    return addSourceBuffer.call(this, mimeType);
  };

  const appendBuffer = SourceBuffer.prototype.appendBuffer;
  SourceBuffer.prototype.appendBuffer = function(data) {
    if (this.videoTracks.length > 0) {
      lastSegmentSize = data.byteLength;
    }
    return appendBuffer.call(this, data);
  };

  return {
    getMediaSourceByUrl(url) {
      return urlToMediaSource[url];
    }
  };
}

import { observe } from 'disco';

Array.from(document.querySelectorAll('video')).forEach((video) =>
  onconnected({ target: video })
);

observe('video,mux-video');
document.addEventListener('connected', onconnected, true);

const { getMediaSourceByUrl } = interceptMediaSource();

let segmentDuration;
let lastAudioBitrate = 0;
let lastVideoBitrate = 0;
let lastBitrate = 0;
let fireOnFirstAppend = false;

async function onconnected({ target: video }) {
  console.log('CONNECTED', video);

  video.addEventListener('disconnected', ondisconnected);

  if (video.tagName.includes('-')) {
    await customElements.whenDefined(video.tagName.toLowerCase());
  }

  video.addEventListener('loadstart', onloadstart);
  video.addEventListener('loadedmetadata', onloadedmetadata);
  video.addEventListener('resize', onresize);
}

async function ondisconnected({ target: video }) {
  console.log('DISCONNECTED', video);
}

function onloadstart() {
  segmentDuration = undefined;
  lastAudioBitrate = 0;
  lastVideoBitrate = 0;
  lastBitrate = 0;
  fireOnFirstAppend = false;
}

function onloadedmetadata({ target: video }) {
  const mediaSource = video.srcObject || getMediaSourceByUrl(video.src);
  const sourceBufferList =
    (mediaSource && mediaSource.activeSourceBuffers) || [];

  for (let i = 0; i < sourceBufferList.length; i++) {
    const sourceBuffer = sourceBufferList[i];
    sourceBuffer.addEventListener(
      'updateend',
      onupdateend.bind(sourceBuffer, video)
    );
  }
}

function onupdateend(video, e) {
  const { target: sourceBuffer } = e;
  if (sourceBuffer.buffered.length === 0) return;

  if (
    !sourceBuffer.lastEnd ||
    sourceBuffer.buffered.end(0) > sourceBuffer.lastEnd
  ) {
    segmentDuration =
      sourceBuffer.buffered.end(0) - (sourceBuffer.lastEnd || 0);
    sourceBuffer.lastEnd = sourceBuffer.buffered.end(0);
    // console.log('segmentDuration', segmentDuration);
  }

  if (!sourceBuffer.lastSegmentSize || sourceBuffer.lastSegmentSize < 8e3)
    return;

  const bitrate = Math.round(
    (sourceBuffer.lastSegmentSize * 8) / segmentDuration / 1000
  );

  if (sourceBuffer.mimeType.includes('audio')) {
    lastAudioBitrate = bitrate;
  } else {
    lastVideoBitrate = bitrate;
  }

  if (lastVideoBitrate > 0) {
    lastBitrate = lastVideoBitrate + lastAudioBitrate;

    if (fireOnFirstAppend) {
      fireOnFirstAppend = false;
      onresize({ target: video });
    }
  }
}

function onresize({ target: video }) {
  if (lastBitrate === 0) {
    fireOnFirstAppend = true;
  }

  // if there is no parent window, window.parent refers to the current window.
  window.parent.postMessage(
    {
      event: 'plx-resize',
      data: {
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        bitrate: lastBitrate ? lastBitrate * 1000 : undefined,
      },
    },
    '*'
  );

  console.log(
    'renditionchange',
    video.videoWidth,
    video.videoHeight,
    lastBitrate,
    'kbps'
  );
}

function interceptMediaSource() {
  const urlToMediaSource = {};

  const createObjectURL = URL.createObjectURL;
  URL.createObjectURL = function (mediaSource) {
    const url = createObjectURL(mediaSource);
    urlToMediaSource[url] = mediaSource;
    return url;
  };

  const addSourceBuffer = MediaSource.prototype.addSourceBuffer;
  MediaSource.prototype.addSourceBuffer = function (mimeType) {
    const sourceBuffer = addSourceBuffer.call(this, mimeType);
    sourceBuffer.mimeType = mimeType;
    return sourceBuffer;
  };

  const appendBuffer = SourceBuffer.prototype.appendBuffer;
  SourceBuffer.prototype.appendBuffer = function (data) {
    this.lastSegmentSize = data.byteLength;
    return appendBuffer.call(this, data);
  };

  return {
    getMediaSourceByUrl(url) {
      return urlToMediaSource[url];
    },
  };
}

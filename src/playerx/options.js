export const options = {
  npmCdn: 'https://cdn.jsdelivr.net/npm',
  players: {
    html: {
      type: 'video',
    },
    hls: {
      pattern: /\.m3u8($|\?)/i,
      type: 'hls-video',
      pkg: 'hls-video-element',
    },
    dash: {
      pattern: /\.mpd($|\?)/i,
      type: 'dash-video',
      pkg: 'dash-video-element',
    },
    jwplayer: {
      pattern: /jwplayer\.com\/players\/(\w+)(?:-(\w+))?/,
      type: 'jwplayer-video',
      pkg: 'jwplayer-video-element',
    },
    vimeo: {
      pattern: /vimeo\.com\/(?:video\/)?(\d+)/,
      type: 'vimeo-video',
      pkg: 'vimeo-video-element',
      // jsUrl: 'http://127.0.0.1:8000/dist/vimeo-video-element.js',
    },
    youtube: {
      pattern: /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/,
      type: 'youtube-video',
      pkg: '@luwes/youtube-video-element',
    },
    wistia: {
      pattern: /(?:wistia\.com|wi\.st)\/(?:medias|embed)\/(.*)$/,
      type: 'wistia-video',
      pkg: 'wistia-video-element',
    },
  },
};

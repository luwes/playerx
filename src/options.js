export const options = {
  npmCdn: 'https://cdn.jsdelivr.net/npm',
  players: {
    html: {
      type: 'video',
    },
    hls: {
      pattern: /\.m3u8($|\?)/i,
      type: 'hls-video',
      pkg: '@luwes/hls-video-element',
      version: '0.1',
      jsUrl: '{{npmCdn}}/{{pkg}}@{{version}}/dist/hls-video-element.js',
    },
    dash: {
      pattern: /\.mpd($|\?)/i,
      type: 'dash-video',
      pkg: 'dash-video-element',
      version: '0.0',
      jsUrl: '{{npmCdn}}/{{pkg}}@{{version}}/dist/{{pkg}}.js',
    },
    muxplayer: {
      pattern: /stream\.mux\.com\/(\w+)|\?player=muxplayer/,
      type: 'mux-player',
      pkg: '@mux/mux-player',
      version: '1.6',
      jsUrl: '{{npmCdn}}/{{pkg}}@{{version}}/dist/mux-player.js',
    },
    jwplayer: {
      pattern: /jwplayer\.com\/players\/(\w+)(?:-(\w+))?/,
      type: 'jwplayer-video',
      pkg: 'jwplayer-video-element',
      version: '0.2',
      jsUrl: '{{npmCdn}}/{{pkg}}@{{version}}/+esm',
    },
    vimeo: {
      pattern: /vimeo\.com\/(?:video\/)?(\d+)/,
      type: 'vimeo-video',
      pkg: 'vimeo-video-element',
      version: '0.2',
      jsUrl: '{{npmCdn}}/{{pkg}}@{{version}}/+esm',
      // jsUrl: 'http://127.0.0.1:8000/dist/vimeo-video-element.js',
    },
    youtube: {
      pattern: /(?:youtu\.be\/|youtube\.com\/(?:shorts\/|embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/,
      type: 'youtube-video',
      pkg: 'youtube-video-element',
      version: '0.2',
      jsUrl: '{{npmCdn}}/{{pkg}}@{{version}}/+esm',
    },
    wistia: {
      pattern: /(?:wistia\.com|wi\.st)\/(?:medias|embed)\/(.*)$/,
      type: 'wistia-video',
      pkg: 'wistia-video-element',
      version: '0.2',
      jsUrl: '{{npmCdn}}/{{pkg}}@{{version}}/+esm',
    },
  },
};

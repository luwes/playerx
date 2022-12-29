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
      version: '0.1.1',
      jsUrl: '{{npmCdn}}/{{pkg}}@{{version}}/dist/hls-video-element.js',
    },
    dash: {
      pattern: /\.mpd($|\?)/i,
      type: 'dash-video',
      pkg: 'dash-video-element',
      version: '0.0.3',
      jsUrl: '{{npmCdn}}/{{pkg}}@{{version}}/dist/{{pkg}}.js',
    },
    jwplayer: {
      pattern: /jwplayer\.com\/players\/(\w+)(?:-(\w+))?/,
      type: 'jwplayer-video',
      pkg: 'jwplayer-video-element',
      version: '0.1.2',
      jsUrl: '{{npmCdn}}/{{pkg}}@{{version}}/dist/{{pkg}}.js',
    },
    vimeo: {
      pattern: /vimeo\.com\/(?:video\/)?(\d+)/,
      type: 'vimeo-video',
      pkg: 'vimeo-video-element',
      version: '0.1.2',
      jsUrl: '{{npmCdn}}/{{pkg}}@{{version}}/dist/{{pkg}}.js',
      // jsUrl: 'http://127.0.0.1:8000/dist/vimeo-video-element.js',
    },
    youtube: {
      pattern: /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/,
      type: 'youtube-video',
      pkg: '@luwes/youtube-video-element',
      version: '0.4.0',
      jsUrl: '{{npmCdn}}/{{pkg}}@{{version}}/dist/youtube-video-element.js',
    },
    wistia: {
      pattern: /(?:wistia\.com|wi\.st)\/(?:medias|embed)\/(.*)$/,
      type: 'wistia-video',
      pkg: 'wistia-video-element',
      version: '0.1.3',
      jsUrl: '{{npmCdn}}/{{pkg}}@{{version}}/dist/{{pkg}}.js',
    },
  },
};

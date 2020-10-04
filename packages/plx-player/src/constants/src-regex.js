export const AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;
export const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)($|\?)/i;
export const HLS_EXTENSIONS = /\.m3u8($|\?)/i;
export const DASH_EXTENSIONS = /\.mpd($|\?)/i;

export const brightcove = /brightcove\.com\/.*?videos\/(\d+)/;
export const dailymotion = /(?:(?:dailymotion\.com(?:\/embed)?\/video)|dai\.ly)\/(\w+)$/;
export const facebook = /facebook\.com\/.*videos\/(\d+)/;
export const jwplayer = /jwplayer\.com\/players\/(\w+)(?:-(\w+))?/;
export const soundcloud = /(?:soundcloud\.com|snd\.sc)\/(.+)$/;
export const streamable = /streamable\.com\/(\w+)$/;
export const twitch = /twitch\.tv\/videos\/(\d+)($|\?)/;
export const vidyard = /vidyard\..*?\/(?:share|watch)\/(\w+)/;
export const vimeo = /vimeo\.com\/(?:video\/)?(\d+)/;
export const wistia = /(?:wistia\.com|wi\.st)\/(?:medias|embed)\/(.*)$/;
export const youtube = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/;

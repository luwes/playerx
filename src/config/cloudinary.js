// https://cloudinary.com/documentation/video_player_how_to_embed
export const type = 'inline'
export const key = 'cloudinary'
export const name = 'Cloudinary'
export const url = 'https://cloudinary.com'
export const srcPattern = '(?:cloudinary\\.com)/(\\w+)/video/upload/sp_([^,/]+).*?/([^.?/]+)\\.'
export const pkg = 'cloudinary-video-player'
export const cssUrl = '{{npmCdn}}/{{pkg}}@{{version}}/dist/cld-video-player.min.css'
export const jsUrl = '{{npmCdn}}/{{pkg}}@{{version}}/dist/cld-video-player.min.js'
export const apiVar = 'cloudinary'
export const version = '1.5.9'
export const html = '<video{{class=cld-video-player}}{{id=}}{{width=}}{{height=}}{{preload=}}{{autoplay?}}{{muted?}}{{loop?}}{{controls?}}{{playsinline?}}{{autopictureinpicture?}}{{controlslist=}}{{crossorigin=}}></video>'
export const scriptText = `
var cld = {{apiVar}}.Cloudinary.new({ cloud_name: '{{1}}' });
{{callback}}(cld.videoPlayer('{{id}}', {
  publicId: '{{3}}',
  sourceTypes: ['hls', 'dash', 'mp4'],
  transformation: {
    streaming_profile: '{{2}}',
  },
}));
`
export const setup = `
{{html}}
{{css}}
<script src="{{npmCdn}}/cloudinary-core@latest/cloudinary-core-shrinkwrap.min.js"></script>
{{js}}
{{script}}
`

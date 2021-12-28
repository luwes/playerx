export const type = 'inline'
export const key = 'videojs'
export const name = 'video.js'
export const url = 'https://github.com/videojs/video.js'
export const srcPattern = '\\?player=videojs'
export const pkg = 'video.js'
export const cssUrl = '{{npmCdn}}/{{pkg}}@{{version}}/dist/video-js.min.css'
export const jsUrl = '{{npmCdn}}/{{pkg}}@${version}/dist/video.min.js'
export const apiVar = 'videojs'
export const version = '7.11.8'
export const html = `<video-js{{class=}}{{id=}}{{width=}}{{height=}}{{preload=}}{{autoplay?}}{{muted?}}{{loop?}}{{controls?}}{{playsinline?}}{{autopictureinpicture?}}{{controlslist=}}{{crossorigin=}}>
  <source {{src=}}>
</video-js>`
export const scriptText = `{{callback}}({{apiVar}}({{node}}));`

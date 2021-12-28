// https://github.com/video-dev/hls.js
export const type = 'inline'
export const key = 'hlsjs'
export const name = 'hls.js'
export const url = 'https://github.com/video-dev/hls.js'
export const srcPattern = '\\.m3u8($|\\?)'
export const pkg = 'hls.js'
export const jsUrl = '{{npmCdn}}/{{pkg}}@{{version}}/dist/hls.min.js'
export const apiVar = 'Hls'
export const version = '1.0.7'
export const html = '{{video}}'
export const scriptText = `
if ({{apiVar}}.isSupported()) {
  var api = new {{apiVar}}({{options}});
  api.attachMedia({{node}});
  api.loadSource({{src}});
  {{callback}}(api);
}
`

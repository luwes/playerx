// https://github.com/vimeo/player.js
export const type = 'iframe'
export const key = 'vimeo'
export const name = 'Vimeo'
export const url = 'https://vimeo.com'
export const srcPattern = 'vimeo\\.com/(?:video/)?(\\d+)'
export const embedUrl = 'https://player.vimeo.com/video/{{metaId}}?{{params}}'
export const pkg = '@vimeo/player'
export const jsUrl = '{{npmCdn}}/{{pkg}}@{{version}}/dist/player.min.js'
export const apiVar = 'Vimeo'
export const version = '2.16.2'
export const html = '{{iframe}}'
export const scriptText = `{{callback}}(new {{apiVar}}.Player({{node}}));`

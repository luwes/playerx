// https://docs.api.video/docs/video-player-sdk
export const type = 'iframe'
export const key = 'apivideo'
export const name = 'api.video'
export const url = 'https://api.video'
export const srcPattern = 'api\\.video/(?:videos|vod)/(\\w+)'
export const embedUrl = 'https://embed.api.video/vod/{{metaId}}#{{params}}'
export const pkg = '@api.video/player-sdk'
export const jsUrl = '{{npmCdn}}/{{pkg}}@{{version}}/dist/index.js'
export const apiVar = 'PlayerSdk'
export const version = '1.2.6'
export const html = '{{iframe}}';
export const scriptText = `{{callback}}(new {{apiVar}}('#{{id}}'));`

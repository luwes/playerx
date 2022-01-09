// https://github.com/muxinc/elements/tree/main/packages/mux-video
export const type = 'inline'
export const key = 'muxvideo'
export const name = 'Mux'
export const url = 'https://mux.com'
export const srcPattern = '\\?player=muxvideo|stream\\.mux\\.com/(\\w+)\\.'
export const pkg = '@mux-elements/mux-video'
export const jsUrl = '{{npmCdn}}/{{pkg}}@{{version}}/dist/index.js'
export const apiVar = 'MuxVideoElement'
export const version = '0.2.0'
export const html = '<mux-video{{videoAttrs}}></mux-video>'
export const scriptText = `{{callback}}({{node}});`

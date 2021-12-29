// https://shaka-player-demo.appspot.com/docs/api/index.html
export const type = 'inline'
export const key = 'shakaplayer'
export const name = 'Shaka Player'
export const url = 'https://github.com/google/shaka-player'
export const srcPattern = '\\?player=shakaplayer'
export const pkg = 'shaka-player'
export const jsUrl = '{{npmCdn}}/{{pkg}}@{{version}}/dist/shaka-player.compiled.js'
export const apiVar = 'shaka'
export const version = '3.1.0'
export const html = '{{video}}'
export const scriptText = `
var api = new {{apiVar}}.Player({{node}});
api.load({{src}});
{{callback}}(api);
`

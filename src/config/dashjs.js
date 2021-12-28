// https://github.com/Dash-Industry-Forum/dash.js
export const type = 'inline'
export const key = 'dashjs'
export const name = 'dash.js'
export const url = 'https://github.com/Dash-Industry-Forum/dash.js'
export const srcPattern = '\\.mpd($|\\?)'
export const pkg = 'dashjs'
export const jsUrl = '{{npmCdn}}/{{pkg}}@{{version}}/dist/dash.all.min.js'
export const apiVar = 'dashjs'
export const version = '3.2.2'
export const html = '{{video}}'
export const scriptText = `
var api = {{apiVar}}.MediaPlayer().create();
api.initialize({{node}}, {{src}}, {{autoplay}});
{{callback}}(api);
`

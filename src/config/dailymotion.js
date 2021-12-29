// https://developer.dailymotion.com/player/
export const type = 'iframe'
export const key = 'dailymotion'
export const name = 'Dailymotion'
export const url = 'https://www.dailymotion.com'
export const srcPattern = '(?:(?:dailymotion\\.com(?:/embed)?/video)|dai\\.ly)/(\\w+)$'
export const embedUrl = 'https://www.dailymotion.com/embed/video/{{metaId}}'
export const jsUrl = 'https://api.dmcdn.net/all.js'
export const apiVar = 'DM'
export const apiReady = 'dmAsyncInit'
export const version = '1.x.x'
export const html = '{{iframe}}'
export const scriptText = `
function {{apiReady}}() {
  var api = {{apiVar}}.player({{node}}, Object.assign({
    video: {{metaId}}
  }, {{options}});
  if ({{allow}}) api.allow = {{allow}};
  {{callback}}(api);
}
`
export const setup = `
<div{{class}}{{id}}></div>
{{js}}
{{script}}
`

// https://wistia.com/support/developers/player-api
export const type = 'inline'
export const key = 'wistia'
export const name = 'Wistia'
export const url = 'https://wistia.com'
export const srcPattern = '(?:wistia\\.com|wi\\.st)/(?:medias|embed)/(.*)$'
export const embedUrl = 'https://fast.wistia.net/embed/iframe/{{metaId}}'
export const jsUrl = 'https://fast.wistia.com/assets/external/E-v1.js'
export const apiVar = 'Wistia'
export const version = '2.x.x'
export const html = '{{iframe}}'
export const scriptText = `
window._wq.push({
  id: '{{metaId}}',
  options: {{options}},
  onReady: function(api) {
    {{callback}}(api);
  }
});
`
export const setup = `
<div class="wistia_embed wistia_async_{{metaId}}"{{id=}}></div>
{{js}}
{{script}}
`

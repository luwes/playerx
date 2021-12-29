// https://knowledge.vidyard.com/hc/en-us/articles/360019034753
export const type = 'iframe'
export const key = 'vidyard'
export const name = 'Vidyard'
export const url = 'https://www.vidyard.com'
export const srcPattern = 'vidyard\\..*?/(?:share|watch)/(\\w+)'
export const embedUrl = 'https://play.vidyard.com/{{metaId}}?{{params}}'
export const jsUrl = 'https://play.vidyard.com/embed/v{{version}}.js'
export const apiVar = 'VidyardV4'
export const apiReady = 'onVidyardAPI'
export const version = '4'
export const html = '{{iframe}}'
export const scriptText = `
function {{apiReady}}() {
  {{apiVar}}.api.renderPlayer(Object.assign({
    uuid: '{{metaId}}',
    container: {{node}}
  }, {{options}}))
    .then(function(api) {
      {{callback}}(api);
    });
}
`
export const setup = `
<div{{class=}}{{id=}}></div>
{{js}}
{{script}}
`

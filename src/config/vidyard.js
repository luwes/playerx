// https://knowledge.vidyard.com/hc/en-us/articles/360019034753
export const type = 'iframe'
export const key = 'vidyard'
export const name = 'Vidyard'
export const url = 'https://www.vidyard.com'
export const srcPattern = 'vidyard\\..*?/(?:share|watch)/(\\w+)'
export const embedUrl = 'https://play.vidyard.com/{{metaId}}?{{params}}'
export const jsUrl = 'https://play.vidyard.com/embed/v4.js'
export const apiVar = 'VidyardV4'
export const apiReady = 'onVidyardAPI'
export const version = '4.0.0'
export const html = '{{iframe}}'
export const scriptText = `
function {{apiReady}}() {
  {{callback}}({{apiVar}}.api.renderPlayer({{node}}));
}
`
export const setup = `
<img class="vidyard-player-embed"{{id=}} src="https://play.vidyard.com/{{metaId}}.jpg" data-uuid="{{metaId}}" data-v="4" data-type="inline" style="width: 100%; margin: auto; display: block;">
{{js}}
{{script}}
`

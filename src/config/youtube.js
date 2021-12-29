// https://developers.google.com/youtube/iframe_api_reference
export const type = 'iframe'
export const key = 'youtube'
export const name = 'YouTube'
export const url = 'https://www.youtube.com'
export const srcPattern = '(?:youtu\\.be/|youtube\\.com/(?:embed/|v/|watch\\?v=|watch\\?.+&v=))((\\w|-){11})'
export const embedUrl = 'https://www.youtube.com/embed/{{metaId}}?{{params}}'
export const jsUrl = 'https://www.youtube.com/iframe_api'
export const apiVar = 'YT'
export const apiReady = 'onYouTubeIframeAPIReady'
export const version = '1.x.x'
export const html = '{{iframe}}'
export const scriptText = `
function {{apiReady}}() {
  {{callback}}(new {{apiVar}}.Player({{node}}));
}
`

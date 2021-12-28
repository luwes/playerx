// https://developers.cloudflare.com/stream/viewing-videos/using-the-player-api
export const type = 'iframe'
export const key = 'cloudflare'
export const name = 'Cloudflare'
export const url = 'https://www.cloudflare.com'
export const srcPattern = '(?:cloudflarestream\\.com|videodelivery\\.net)/(\\w+)'
export const embedUrl = 'https://iframe.videodelivery.net/{{metaId}}?{{params}}'
export const paramsType = '&'
export const jsUrl = 'https://embed.videodelivery.net/embed/sdk.latest.js'
export const apiVar = 'Stream'
export const version = '1.x.x'
export const html = '{{iframe}}'
export const scriptText = `{{callback}}({{apiVar}}({{node}}));`

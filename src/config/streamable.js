// https://github.com/embedly/player.js
export const type = 'iframe'
export const key = 'streamable'
export const name = 'Streamable'
export const url = 'https://streamable.com'
export const srcPattern = 'streamable\\.com/(\\w+)$'
export const embedUrl = 'https://streamable.com/o/{{metaId}}'
export const jsUrl = 'https://cdn.embed.ly/player-0.1.0.min.js'
export const apiVar = 'playerjs'
export const version = '1.x.x'
export const html = '{{iframe}}';
export const scriptText = `{{callback}}(new {{apiVar}}.Player({{node}}));`

// https://developer.jwplayer.com/jwplayer/docs/jw8-javascript-api-reference
export const type = 'inline'
export const key = 'jwplayer'
export const name = 'JWPlayer'
export const url = 'https://www.jwplayer.com'
export const srcPattern = 'jwplayer\\.com/players/(\\w+)(?:-(\\w+))?'
export const embedUrl = 'https://cdn.jwplayer.com/players/{{metaId}}-{{2}}.html'
export const jsUrl = 'https://content.jwplatform.com/libraries/{{2}}.js'
export const apiVar = 'jwplayer'
export const version = '8.12.5'
export const html = '<div{{class=}}{{id=}}{{style=}}></div>'
export const scriptText = `
fetch('https://cdn.jwplayer.com/v2/media/{{metaId}}')
  .then(function(response) { return response.json(); })
  .then(function(config) {
    {{callback}}({{apiVar}}({{node}}).setup(
      Object.assign(config, {{options}})
    ));
  });
`

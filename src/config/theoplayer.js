// https://docs.theoplayer.com/getting-started/01-sdks/01-web/00-getting-started.md
export const type = 'inline'
export const key = 'theoplayer'
export const name = 'THEOplayer'
export const url = 'https://www.theoplayer.com'
export const srcPattern = '\\?player=theoplayer'
export const cssUrl = '{{libraryLocation}}/ui.css'
export const jsUrl = '{{libraryLocation}}/THEOplayer.js'
export const apiVar = 'THEOplayer'
export const version = '1.x.x'
export const html = '<div class="video-js theoplayer-skin"{{id}}></div>'
export const scriptText = `
{{callback}}(new {{apiVar}}.Player({{node}}, {
  {{libraryLocation}},
  {{license}},
}));
`

// https://developers.facebook.com/docs/plugins/embedded-video-player/api/
export const type = 'iframe'
export const key = 'facebook'
export const name = 'Facebook'
export const url = 'https://www.facebook.com'
export const srcPattern = 'facebook\\.com/.*videos/(\\d+)'
export const embedUrl = 'https://www.facebook.com/v3.2/plugins/video.php?allowfullscreen=true&href={{src}}'
export const jsUrl = 'https://connect.facebook.net/en_US/sdk.js'
export const apiVar = 'FB'
export const apiReady = 'fbAsyncInit'
export const version = '3.2'
export const html = '{{iframe}}'
export const scriptText = `
function {{apiReady}}() {
  {{apiVar}}.init({
    appId: {{appId}},
    version: {{version}},
    xfbml: true,
  });

  {{apiVar}}.Event.subscribe('xfbml.ready', msg => {
    if (msg.type === 'video' && msg.id === {{id}}) {
      {{node}}.querySelector('iframe').allow = {{allow}};
      {{callback}}(msg.instance);
    }
  });
}
`
export const setup = `
<div class="fb-video"{{id}} data-href="{{src}}" data-allowfullscreen="true" data-width="{{width}}" data-height="{{height}}"></div>
{{js}}
{{script}}
`

const defaults = {
  npmCdn: 'https://cdn.jsdelivr.net/npm',
  callback: null,
  controls: true,
  params: '',
  options: `{}`,

  videoAttrs: `{{class=}}{{id=}}{{width=}}{{height=}}{{src=}}{{poster=}}{{preload=}}{{autoplay?}}{{muted?}}{{loop?}}{{controls?}}{{playsinline?}}{{autopictureinpicture?}}{{controlslist=}}{{crossorigin=}}`,

  video: '<video{{videoAttrs}}></video>',

  allow: `accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture`,

  iframe: `<iframe{{class=}}{{id=}}{{width=}}{{height=}} src="{{embedUrl}}" frameborder="0" allowfullscreen{{allow=}}></iframe>`,

  node: `document.querySelector('#{{id}}')`,
  css: '<link rel="stylesheet" href="{{cssUrl}}">',
  js: '<script src="{{jsUrl}}"></script>',
  script: '<script>{{scriptText}}</script>',
  setup: `
{{html}}
{{js}}
{{script}}
`,
};

export function getHtml(opts) {
  let matches = [];
  if (opts.src && opts.srcPattern) {
    matches = opts.src.match(opts.srcPattern);
  }

  opts = {
    ...defaults,
    ...matches,
    metaId: matches[1],
    id: 'plx-' + nanoid(),
    ...opts,
  };

  render(opts);
  render(opts);

  if (opts.type === 'inline' || opts.api) {
    return opts.setup;
  }
  return opts.html;
}

function render(opts) {
  Object.keys(opts).forEach((key) => {
    const opt = opts[key];
    if (typeof opt === 'string') {
      opts[key] = populate(opt, opts);
    }
  });
}

export function populate(template, obj) {
  let delimiter = '';
  return template.replace(
    /\{\{\s*(\w+)([=?-\\:])?([\w-]+?)?\s*\}\}/g,
    function (match, key, mod, fallback) {
      let val = obj[key];
      val = val != null ? val : fallback
      if (val != null) {
        // mod for adding json key/value
        if (mod === ':') {
          let out = `${delimiter}"${key}": "${val}"`;
          delimiter = ', ';
          return out;
        }
        // mod for adding html value attributes
        if (mod === '=') {
          return ` ${key}="${val}"`;
        }
        // mod for adding html boolean attributes
        if (mod === '?') {
          if ([true, '1', 'true'].includes(val)) return ` ${key}`;
          return '';
        }
        return val;
      }
      return '';
    }
  );
}

export function nanoid(length = 3) {
  return Math.random().toString(36).slice(-length);
}

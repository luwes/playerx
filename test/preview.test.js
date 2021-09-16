import test from 'tape';
import { PlxPreview } from '../dist/preview.js';

// let container;
// const src = 'https://vimeo.com/357274789';
// const image = 'https://i.vimeocdn.com/video/810965406_960.jpg';

test('creates an element', (t) => {
  const preview = new PlxPreview();
  t.assert(preview instanceof HTMLElement);
  t.end();
});

test('setting src creates an img element with src', (t) => {
  let container = document.createElement('div');
  document.body.appendChild(container);

  const preview = new PlxPreview();
  container.appendChild(preview);
  t.equal(container.innerHTML, '<plx-preview></plx-preview>');

  preview.src = 'https://i.vimeocdn.com/video/810965406_960.avif';
  t.equal(container.innerHTML, '<plx-preview src="https://i.vimeocdn.com/video/810965406_960.avif"><picture><img src="https://i.vimeocdn.com/video/810965406_960.avif"></picture></plx-preview>');

  document.body.removeChild(container);

  t.end();
});

test('defining html creates an img element with src, alt, aria-label', (t) => {
  let container = document.createElement('div');
  document.body.appendChild(container);

  container.innerHTML = '<plx-preview src="https://i.vimeocdn.com/video/810965406_960.avif" title="Travis" loading="lazy"></plx-preview>';

  t.equal(container.innerHTML, '<plx-preview src="https://i.vimeocdn.com/video/810965406_960.avif" title="Travis" loading="lazy"><picture><img loading="lazy" src="https://i.vimeocdn.com/video/810965406_960.avif" alt="Travis" aria-label="Travis"></picture></plx-preview>');

  document.body.removeChild(container);

  t.end();
});

test('defining html with oembedurl', async (t) => {
  let container = document.createElement('div');
  document.body.appendChild(container);

  container.innerHTML = '<plx-preview src="https://vimeo.com/357274789"></plx-preview>';

  await container.firstChild.load();

  t.equal(container.innerHTML, '<plx-preview src="https://vimeo.com/357274789"><picture><img src="https://i.vimeocdn.com/video/810965406_1280" alt="Travis Scott - Made in America" aria-label="Travis Scott - Made in America"></picture><style>  player-x plx-preview { display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; } plx-preview { display: block; } plx-preview img { position: relative; width: 100%; height: auto; } plx-preview[hidden] { pointer-events: none; } </style></plx-preview>');

  document.body.removeChild(container);

  t.end();
});

import test from 'tape';
// import { Playerx } from '../dist/playerx.js';
import { PlxPreview, styles } from '../src/preview/preview.js';

// let container;
// const src = 'https://vimeo.com/357274789';
// const image = 'https://i.vimeocdn.com/video/810965406_960.jpg';

test('PlxPreview creates an element', (t) => {
  const preview = new PlxPreview();
  t.assert(preview instanceof HTMLElement);
  t.end();
});

test('PlxPreview setting src creates an img element with src', (t) => {
  const preview = new PlxPreview();
  document.body.appendChild(preview);
  t.equal(
    document.querySelector('plx-preview').shadowRoot.innerHTML,
    `<style> ${styles}</style>`
  );

  preview.src = 'https://i.vimeocdn.com/video/810965406_960.avif';
  t.equal(
    document.querySelector('plx-preview').shadowRoot.innerHTML,
    `<style> ${styles}</style><picture><img src="https://i.vimeocdn.com/video/810965406_960.avif"></picture>`
  );

  document.querySelector('plx-preview').remove();

  t.end();
});

test('PlxPreview defining html creates an img element with src, alt, aria-label', async (t) => {
  document.body.innerHTML =
    '<plx-preview src="https://i.vimeocdn.com/video/810965406_960.avif" title="Travis" loading="lazy"></plx-preview>';

  t.equal(
    document.querySelector('plx-preview').shadowRoot.innerHTML,
    `<style> ${styles}</style><picture><img loading="lazy" src="https://i.vimeocdn.com/video/810965406_960.avif" alt="Travis" aria-label="Travis"></picture>`
  );

  document.querySelector('plx-preview').remove();

  t.end();
});

test('PlxPreview defining html with oembedurl', async (t) => {
  document.body.innerHTML =
    '<plx-preview src="https://vimeo.com/357274789"></plx-preview>';

  const preview = document.querySelector('plx-preview');

  await preview.load();

  t.equal(
    preview.shadowRoot.innerHTML,
    `<style> ${styles}</style><picture><img src="https://i.vimeocdn.com/video/810965406_1280" alt="Travis Scott - Made in America" aria-label="Travis Scott - Made in America"></picture>`
  );

  preview.remove();

  t.end();
});

test('PlxPreview defining empty element', async (t) => {
  document.body.innerHTML = '<plx-preview></plx-preview>';

  t.equal(
    document.querySelector('plx-preview').shadowRoot.innerHTML,
    `<style> ${styles}</style>`
  );

  document.querySelector('plx-preview').remove();

  t.end();
});

test('PlxPreview + Playerx', async (t) => {
  document.body.innerHTML = '<player-x><plx-preview></plx-preview></player-x>';

  t.equal(
    document.querySelector('plx-preview').shadowRoot.innerHTML,
    `<style> ${styles}</style>`
  );

  document.querySelector('player-x').remove();

  t.end();
});

import test from 'tape';
import { PlxSchema } from '../src/schema/schema.js';

// let container;
// const src = 'https://vimeo.com/357274789';
// const image = 'https://i.vimeocdn.com/video/810965406_960.jpg';

test('PlxSchema creates an element', (t) => {
  const schema = new PlxSchema();
  t.assert(schema instanceof HTMLElement);
  t.end();
});

test('PlxSchema setting src creates a script element', (t) => {
  let container = document.createElement('div');
  document.body.appendChild(container);

  const schema = new PlxSchema();
  container.appendChild(schema);
  t.equal(container.innerHTML, '<plx-schema></plx-schema>');

  schema.src = 'https://vimeo.com/357274789';

  t.equal(container.innerHTML, '<plx-schema src="https://vimeo.com/357274789"></plx-schema>');

  document.body.removeChild(container);

  t.end();
});

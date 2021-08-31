/* global galite */
import { observable } from 'sinuous';
import { hydrate as hy, dhtml } from 'sinuous/hydrate';
import { dropdown } from './helpers/dropdown.js';
import { cx } from './utils/dom.js';
import { invert } from './utils/utils.js';

const burgerIsActive = observable(false);
const openBurgerMenu = invert(burgerIsActive);
const docsDropdown = dropdown();

hy(dhtml`<a id=burger
  class=${cx({ active: burgerIsActive })}
  onclick=${openBurgerMenu} />
`);

hy(dhtml`<div id=main-menu
  class=${cx({ active: burgerIsActive })} />
`);

hy(dhtml`
  <body onclick=${() => docsDropdown.close()} />
`);

// hy(dhtml`
//   <div id=menu-item-docs>
//     <a onclick=${docsDropdown.toggle}
//       aria-expanded=${docsDropdown.isOpen} />
//     <div class="menu-options ${docsDropdown}"
//       hidden=${docsDropdown.isHidden}
//       aria-hidden=${docsDropdown.isHidden} />
//   </div>
// `);

hy(dhtml`<div id=tweet-button onclick=${openTweetWindow} />`);

function openTweetWindow(e) {
  e.preventDefault();
  window.open(
    e.target.href,
    'Twitter',
    `top=${screen.height / 2 - 285},left=${
      screen.width / 2 - 550 / 2
    },width=550,height=285,toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=1`
  );
}

function prefetch(e) {
  if (e.target.tagName != 'A') {
    return;
  }
  if (e.target.origin != location.origin) {
    return;
  }
  var l = document.createElement('link');
  l.rel = 'prefetch';
  l.href = e.target.href;
  document.head.appendChild(l);
}
document.documentElement.addEventListener('mouseover', prefetch, {
  capture: true,
  passive: true,
});
document.documentElement.addEventListener('touchstart', prefetch, {
  capture: true,
  passive: true,
});

const GA_ID = document.documentElement.getAttribute('ga-id');

galite.l = +new Date();
galite('create', GA_ID, 'auto');
galite('set', 'transport', 'beacon');
var timeout = setTimeout(
  (onload = function () {
    clearTimeout(timeout);
    galite('send', 'pageview');
  }),
  1000
);

var ref = +new Date();
function ping(event) {
  var now = +new Date();
  if (now - ref < 1000) {
    return;
  }
  galite('send', {
    hitType: 'event',
    eventCategory: 'page',
    eventAction: event.type,
    eventLabel: Math.round((now - ref) / 1000),
  });
  ref = now;
}
addEventListener('pagehide', ping);
addEventListener('visibilitychange', ping);
addEventListener(
  'click',
  function (e) {
    var button = e.target.closest('button');
    if (!button) {
      return;
    }
    galite('send', {
      hitType: 'event',
      eventCategory: 'button',
      eventAction: button.getAttribute('aria-label') || button.textContent,
    });
  },
  true
);
var selectionTimeout;
addEventListener(
  'selectionchange',
  function () {
    clearTimeout(selectionTimeout);
    var text = String(document.getSelection()).trim();
    if (text.split(/[\s\n\r]+/).length < 3) {
      return;
    }
    selectionTimeout = setTimeout(function () {
      galite('send', {
        hitType: 'event',
        eventCategory: 'selection',
        eventAction: text,
      });
    }, 2000);
  },
  true
);

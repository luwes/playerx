import { observable } from 'sinuous';
import { hydrate as hy, dhtml } from 'sinuous/hydrate';
import { dropdown } from './helpers/dropdown.js';
import { cx } from './utils/dom.js';
import { invert } from './utils/utils.js';

const burgerIsActive = observable(false);
const openBurgerMenu = invert(burgerIsActive);
const pluginsDropdown = dropdown();

hy(dhtml`<a id=burger
  class=${cx({ active: burgerIsActive })}
  onclick=${openBurgerMenu} />
`);

hy(dhtml`<div id=main-menu
  class=${cx({ active: burgerIsActive })} />
`);

hy(dhtml`
  <body onclick=${() => pluginsDropdown.close()} />
`);

hy(dhtml`
  <div id=menu-item-plugins>
    <a onclick=${pluginsDropdown.toggle}
      aria-expanded=${pluginsDropdown.isOpen} />
    <div class="menu-options ${pluginsDropdown}"
      hidden=${pluginsDropdown.isHidden}
      aria-hidden=${pluginsDropdown.isHidden} />
  </div>
`);

hy(dhtml`<div id=tweet-button onclick=${openTweetWindow} />`);

function openTweetWindow(e) {
  e.preventDefault();
  window.open(
    e.target.href,
    'Twitter',
    `top=${screen.height/2-285},left=${screen.width/2-550/2},width=550,height=285,toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=1`
  );
}

import { observable } from 'sinuous';
import { hydrate, dhtml } from 'sinuous/hydrate';

const burgerIsActive = observable(false);
const openBurgerMenu = invert(burgerIsActive);

hydrate(
  dhtml`<a id=burger
    class=${cx({ active: burgerIsActive })}
    onclick=${openBurgerMenu} />`
);

hydrate(
  dhtml`<div id=main-menu
    class=${cx({ active: burgerIsActive })} />`
);

function cx(classes) {
  return function () {
    const { el } = this;
    Object.keys(classes).forEach((key) => {
      const value = classes[key];
      el.classList.toggle(key, typeof value === 'function' ? value() : value);
    });
    return el.className;
  };
}

function invert(accessor) {
  return () => accessor(!accessor());
}

hydrate(dhtml`<div id=tweet-button onclick=${openTweetWindow} />`);

function openTweetWindow(e) {
  e.preventDefault();
  window.open(
    e.target.href,
    'Twitter',
    `top=${screen.height/2-285},left=${screen.width/2-550/2},width=550,height=285,toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=1`
  );
}

import { onTurbolinksLoad } from '../turbolinks_lcm';
import { forEach, oneAddEventListeners } from '../helpers';

let   VISITED_PAGES = [];
const ANIMATION_END = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

function getTargets() {
  return document.querySelectorAll('[data-animate]');
}

function animationClass(action, cssClass, target) {
  target.classList[action]('animated', cssClass);
}

function animation(action, name, fn) {
  forEach(getTargets(), target => {
    animationClass(action, name, target);

    if (typeof fn === 'function') fn(target, name);
  });
}

function removeAnimationAfterEnd(target, name) {
  oneAddEventListeners(target, ANIMATION_END, () => {
    animationClass('remove', name, target)
  });
}

function getCurrentLocation () {
  return window.location.href.replace(/[#|?].*$/g, '');
}

const oneAnimateCSS = name => {
  const currentLocation = getCurrentLocation();

  if ( VISITED_PAGES.indexOf( currentLocation ) < 0 ) {
    animation('add', name, removeAnimationAfterEnd);

    VISITED_PAGES.push( currentLocation );
  }
};

const animateCSS       = (name) => animation('add', name);
const addAnimateCSS    = animateCSS;
const removeAnimateCSS = (name) => animation('remove', name);

function init() {
  onTurbolinksLoad(
    () => oneAnimateCSS('fadeIn')
  );
}

export default { init }

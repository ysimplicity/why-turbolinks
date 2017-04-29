import { forEach } from '../helpers';
import { handleElementEventOnTurbolinksLifeCycle } from '../turbolinks_lcm';

const OPEN_CSS_CLASS = 'popover-open';

function closeAnyOpen(e) {
  const containers = document.querySelectorAll('.popover');

  forEach(containers, ({classList}) => classList.remove(OPEN_CSS_CLASS));
}

function manageContainerVisibilitiy({ classList }) {
  const visible = classList.contains(OPEN_CSS_CLASS)

  if ( visible ) {
    classList.remove(OPEN_CSS_CLASS);
  } else {
    closeAnyOpen();
    classList.add(OPEN_CSS_CLASS);
  }

  return { visible };
}

function findContainerWith(navigationLink) {
  const idSelector = navigationLink.getAttribute('href');

  return document.querySelector(idSelector);
}

function handleClick(e) {
  e.preventDefault();

  const container = findContainerWith(this);
  const { visible } = manageContainerVisibilitiy(container);

  if ( !visible ) {
    e.stopImmediatePropagation();
  }
}

function handleElementEvent(listen) {
  closeAnyOpen();

  const links = document.querySelectorAll('[data-popover]');

  forEach(links, link => listen(link, 'click', handleClick));
}

export default {
  init() {
    handleElementEventOnTurbolinksLifeCycle(
      handleElementEvent,
      { DOMSideEffects: true }
    );
  }
};

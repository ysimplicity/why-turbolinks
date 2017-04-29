import TURBOLINKS_EVENTS from './turbolinks_events';
import { logEvent, logHelper } from './turbolinks_logger';

const { addEventListener, removeEventListener } = document;

function onTurbolinks(eventKey, fn) {
  const eventName = TURBOLINKS_EVENTS[eventKey];

  addEventListener(eventName, function handler(event) {
    logEvent(eventName);

    fn(event, {handler, eventName, log: logHelper});
  });
}

export const onTurbolinksClick        = fn => onTurbolinks('CLICK', fn);
export const onTurbolinksBeforeVisit  = fn => onTurbolinks('BEFORE_VISIT', fn);
export const onTurbolinksRequestStart = fn => onTurbolinks('REQUEST_START', fn);
export const onTurbolinksVisit        = fn => onTurbolinks('VISIT', fn);
export const onTurbolinksRequestEnd   = fn => onTurbolinks('REQUEST_END', fn);
export const onTurbolinksBeforeCache  = fn => onTurbolinks('BEFORE_CACHE', fn);
export const onTurbolinksBeforeRender = fn => onTurbolinks('BEFORE_RENDER', fn);
export const onTurbolinksRender       = fn => onTurbolinks('RENDER', fn);
export const onTurbolinksLoad         = fn => onTurbolinks('LOAD', fn);

function handleOneTurbolinks(fn) {
  return function(event, options) {
    const {handler, eventName} = options;

    removeEventListener(eventName, handler);

    fn(event, options);
  }
}

export function oneTurbolinksLoad(fn) {
  onTurbolinksLoad(handleOneTurbolinks(fn));
}

// export function oneTurbolinksBeforeCache(fn) {
//   onTurbolinksBeforeCache(handleOneTurbolinks(fn));
// }

export function onTurbolinksSetup(fnSetup) {
  oneTurbolinksLoad(function() {
    fnSetup.apply(null, arguments);

    onTurbolinksRender(fnSetup);
  });
}

export function onTurbolinksTeardown(fnTeardown, hasDOMSideEffects) {
  const onEventListener = hasDOMSideEffects ?
                          onTurbolinksBeforeRender :
                          onTurbolinksBeforeCache;

  onEventListener(fnTeardown);
}

export function onTurbolinksLifeCycle(fnSetup,
                                      fnTeardown,
                                      options = { DOMSideEffects: true }) {
  const {DOMSideEffects} = options;

  onTurbolinksSetup(fnSetup);
  onTurbolinksTeardown(fnTeardown, DOMSideEffects);
}

function onElementEventWithTurbolinks(action, fn) {
  const listenerProp = `${action}EventListener`;
  const listen = (element, event, handler) => element[listenerProp](event, handler)

  return function() { fn(listen) };
}

export function handleElementEventOnTurbolinksLifeCycle(fn, options = {}) {
  onTurbolinksLifeCycle(
    onElementEventWithTurbolinks('add', fn),    // Setup
    onElementEventWithTurbolinks('remove', fn), // Teardown
    options
  );
}

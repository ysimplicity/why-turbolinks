import TURBOLINKS_EVENTS from './turbolinks_events';
import isATurbolinksCachePreview from './turbolinks_cache_preview';

const LOG_STACK_FILLS = '------ ';

const DEFAULT_METHOD = 'log';

const CONFIG = {
  enableLog: false,
  enableStackLog: false,
  method: DEFAULT_METHOD,
};

const consoleLog = (msg) => console[CONFIG.method](msg);

export const logEvent = (name, isStackCall = false) => {
  if ( CONFIG.enableLog ) {
    const cache = isATurbolinksCachePreview() ? '[CACHE] ' : '';

    let stack = '';

    if ( CONFIG.enableStackLog ) {
      stack = isStackCall ? '[STACK] ' : LOG_STACK_FILLS;
    }

    consoleLog(`${stack}${cache}${name}`);
  }
}

export const logHelper = (msg) => {
  if ( CONFIG.enableLog ) {
    const stack = CONFIG.enableStackLog ? LOG_STACK_FILLS : '';

    consoleLog(`${stack}    ${msg}`)
  }
}

export default {
  enable() {
    return CONFIG.enableLog = true
  },

  setMethod(prop) {
    if ( console.hasOwnProperty(prop) ) {
      CONFIG.method = prop;
    }
  },

  showStackCall() {
    CONFIG.enableStackLog = this.enable();

    for (let key in TURBOLINKS_EVENTS) {
      const eventName = TURBOLINKS_EVENTS[key];

      document.addEventListener(eventName , () => {
        logEvent(eventName, true)
      });
    }
  }
};

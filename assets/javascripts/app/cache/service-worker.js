const MAIN_FILE = 'service-worker.js';

function inAValidHost() {
  const {protocol, hostname} = window.location;

  return (protocol === 'https:' || hostname === 'localhost');
}

function hasSupport() {
  return 'serviceWorker' in navigator && inAValidHost();
}

function setupSW() {
  navigator.serviceWorker.register(MAIN_FILE, {
    scope: './'
  }).then(function(registration) {
    if (typeof registration.update == 'function') {
      registration.update();
    }
  }).catch(function(e) {
    console.error('Error during service worker registration:', e);
  });
}

function init() {
  const supported = hasSupport();

  if (supported) {
    setupSW();
  }

  return supported;
}

export default { init }

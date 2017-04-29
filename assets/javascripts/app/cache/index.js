import AppServiceWorker from './service-worker';

function appcacheUpdate() {
  window.location.reload();
}

function handleAppcache() {
  // Check if a new cache is available on page load.
  const appcache = window.applicationCache;

  appcache.addEventListener('updateready', function(e) {
    if (appcache.status == appcache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      // Swap it in and reload the page to get the new hotness.
      appcache.swapCache();

      appcacheUpdate();
    }
  });
}

function setup() {
  if ( !AppServiceWorker.init() ) {
    handleAppcache();
  }
}

export default {
  init() {
    window.addEventListener('load', setup);
  }
}

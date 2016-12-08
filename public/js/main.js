"use strict";

if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
  
  navigator.serviceWorker.register('service-worker.js', {
    scope: './'
  }).then(function(registration) {
    if (typeof registration.update == 'function') {
      registration.update();
    }
  }).catch(function(e) {
    console.error('Error during service worker registration:', e);
  });
  
}

document.addEventListener('turbolinks:load', function() {
  
  function popoverCloser(e) {
    for (var i = 0; i < popoverGrid.length; i++) {
        popoverGrid[i].classList.remove('popover-open')
    }
  }
  function popoverManager(e) {
    e.preventDefault();
    
    if( document.querySelector(this.getAttribute('href')).classList.contains('popover-open') ) {
      document.querySelector(this.getAttribute('href')).classList.remove('popover-open');
    } else {
      popoverCloser();
      document.querySelector(this.getAttribute('href')).classList.add('popover-open');
      e.stopImmediatePropagation();
    }
  }
    
  var index,
      popoverGrid = document.querySelectorAll('.popover'),
      navigationLinks = document.querySelectorAll('[data-popover]');
  
  for (index = 0; index < navigationLinks.length; index++) {
    navigationLinks[index].addEventListener('click', popoverManager);
  }
    
});

document.addEventListener('turbolinks:load', function (event) {
  
  if ( typeof ga === 'function' ) {
    ga('set', 'location', event.data.url);
    ga('send', 'pageview');
  }
  
});
    
Turbolinks.start();

import { onTurbolinksLoad } from '../turbolinks_lcm';

function init() {
  onTurbolinksLoad(event => {
    if ( typeof ga === 'function' ) {
      ga('set', 'location', event.data.url);
      ga('send', 'pageview');
    }
  });
}

export default { init }

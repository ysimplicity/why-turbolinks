import Turbolinks from 'turbolinks';

import TurbolinksLogger from './app/turbolinks_logger';

import AppCache from './app/cache';
import AppModules from './app/modules';

// TurbolinksLogger.enable();
// TurbolinksLogger.showStackCall();

AppCache.init();
AppModules.init();

Turbolinks.start();

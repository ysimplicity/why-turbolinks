import { forEach } from '../helpers';

import ArticlesSelector from './articles-selector';
import NavigationLinks from './navigation-links';
import GoogleAnalytics from './google-analytics';
import FirebaseSetup from './firebase-setup';
import Animations from './animations';

const MODULES = [
  ArticlesSelector,
  NavigationLinks,
  GoogleAnalytics,
  FirebaseSetup,
  Animations
];

export default {
  init() {
    forEach(MODULES, mod => mod.init());
  }
}

import vex from '../vex';
import firebase from 'firebase';
import 'firebase/messaging';

import { oneTurbolinksLoad } from '../turbolinks_lcm';

const getConfig = (function() {
  let config;

  return function(prop) {
    if (!config) {
      const bodyDataset = document.querySelector('body').dataset;

      config = {
        hosts: JSON.parse(bodyDataset.hosts),
        firebase: JSON.parse(bodyDataset.firebase)
      }
    }

    return config[prop];
  }
})();

const NotificationServerAPI = {
  getUsersResource() {
    const host = getConfig('hosts').notifications_server;

    return `${host}/api/users`;
  },

  syncUser(data) {
    const resource = this.getUsersResource();

    const payload = {
      headers: { "Content-Type": "application/json" },
      method: 'POST',
      mode: 'cors',
      body: data,
    };

    fetch(resource, payload)
      .then( response => {
        if (response.status < 200 || response.status >= 400) {
          throw `Error to send user data: ${ response.status } - ${ response.text() }`;
        }
      })
      .catch( error => console.error(error) );
  }
}

class NotificationServer {
  constructor(token) {
    this.token = token;
  }

  hasNewToken() {
    const KEY_NAME = '__firebaseToken__';

    const currentToken = window.sessionStorage.getItem(
      KEY_NAME
    );

    if (currentToken) {
      return currentToken !== this.token;

    } else {
      window.sessionStorage.setItem(
        KEY_NAME,
        this.token
      );

      return true
    }
  }

  saveUser() {
    if ( this.hasNewToken() ) {
      const data = JSON.stringify({
        user: {
          token: this.token
        }
      });

      NotificationServerAPI.syncUser( data );
    }
  }
}

const Notifications = {
  handleRequestPermission(messaging) {
    messaging.requestPermission()
    .then(() => { return messaging.getToken() })
    .then(( token ) => new NotificationServer(token).saveUser())
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
  },

  buildDialogMessage({ title, body }) {
    return `
      <strong>${title}</strong>
      <div style="font-weight: 300;">
        ${ (body + '').trim() }
      </div>
    `;
  },

  showDialogWith(payload) {
    const { notification } = payload;
    const { click_action } = notification;
    const unsafeMessage = this.buildDialogMessage(notification);

    vex.dialog.confirm({
      unsafeMessage,
      callback: function(value) {
        if (value && click_action) {
          Turbolinks.visit(click_action, { action: 'replace' });
        }
      }
    });
  }
}

function firebaseSetup() {
  firebase.initializeApp(getConfig('firebase'));

  const messaging = firebase.messaging();

  Notifications.handleRequestPermission(messaging);

  messaging.onMessage(function(payload) {
    Notifications.showDialogWith(payload)
  });
}

export default {
  init() {
    oneTurbolinksLoad(firebaseSetup);
  }
};

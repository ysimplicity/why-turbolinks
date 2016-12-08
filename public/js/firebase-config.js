window.WebApp = window.WebApp || {};

WebApp.notificationServer = {
  host: 'http://localhost:3000',
  
  getUsersResource: function() {
    return this.host + '/api/users';
  },
  buildUserData: function(token) {
    var user, data = {};
    
    if (firebase.auth) {
      user = firebase.auth().currentUser || {};
    } else {
      user = {};
    }
    
    data['uid'] = user.uid;
    data['email'] = user.email;
    data['token'] = token;
    
    return JSON.stringify({ user: data });
  },
  hasNewToken: function(token) {
    var keyName = 'fireToken';
    var currentToken = window.sessionStorage.getItem(keyName);
    
    if (currentToken) {
      return currentToken !== token;
      
    } else {
      window.sessionStorage.setItem(keyName, token);
      
      return true
    }
  },
  saveUser: function(token) {
    if ( this.hasNewToken(token) ) {
      var userData = this.buildUserData(token);
      
      fetch(this.getUsersResource(), {
        headers: { "Content-Type": "application/json" },
        method: 'POST',
        mode: 'cors',
        body: userData,
      }).then(function(response) {
        if (response.status < 200 || response.status >= 400) {
          throw 'Error to send user data: ' + response.status + ' - ' + response.text();
        }
      }).catch(function(error) {
        console.error(error);
      });
    }
  }
};

WebApp.notification = WebApp.notification || {};
WebApp.notification.handleRequestPermission = function(messaging) {
  messaging.requestPermission()
  .then(function() {
    return messaging.getToken();
  })
  .then(function(token) {
    WebApp.notificationServer.saveUser(token);
  })
  .catch(function(err) {
    console.log('Unable to get permission to notify.', err);
  });
};

WebApp.notification.buildDialogMessage = function(notification) {
  return [
    '<strong>',
      (notification.title + '').trim(),
    '</strong>',
    '<div style="font-weight: 300;">',
      (notification.body + '').trim(),
    '</div>'
  ].join('');
};

WebApp.notification.showDialogWith = function(payload) {
  var notification = payload.notification;
  var unsafeMessage = this.buildDialogMessage(notification);
  
  vex.dialog.confirm({
    unsafeMessage: unsafeMessage,
    callback: function (value) {
      if (value && notification.click_action) {
        Turbolinks.visit(notification.click_action, { action: 'replace' });
      }
    }
  });
};

WebApp.notification.handleMessage = function(messaging) {
  messaging.onMessage(function(payload) {
    WebApp.notification.showDialogWith(payload)
  });
}

!function() {
  
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDlWQmNLYV3zth7g1C94FdrCu_6LqbF_Mg",
    authDomain: "try-turbolinks.firebaseapp.com",
    databaseURL: "https://try-turbolinks.firebaseio.com",
    messagingSenderId: "15492343574"
  };
  firebase.initializeApp(config);

  var messaging = firebase.messaging();
    
  window.addEventListener('load', function() {
    if( document.querySelector('body').className.indexOf("AX2L") === -1 ) {
      WebApp.notification.handleRequestPermission(messaging);
    }
    
    messaging.onMessage(function(payload) {
      WebApp.notification.showDialogWith(payload)
    });
  });
  
}();

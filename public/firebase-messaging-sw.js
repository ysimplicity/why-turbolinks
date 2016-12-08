importScripts('https://www.gstatic.com/firebasejs/3.6.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.6.2/firebase-messaging.js');

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDlWQmNLYV3zth7g1C94FdrCu_6LqbF_Mg",
  authDomain: "try-turbolinks.firebaseapp.com",
  databaseURL: "https://try-turbolinks.firebaseio.com",
  messagingSenderId: "15492343574"
};
firebase.initializeApp(config);

var messaging = firebase.messaging();

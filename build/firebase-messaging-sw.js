
// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyCDDtEoxuNyBbXMWw78I9uSRitLujlf1eg",
    authDomain: "tech-x-2.firebaseapp.com",
    databaseURL: "https://tech-x-2-default-rtdb.firebaseio.com",
    projectId: "tech-x-2",
    storageBucket: "tech-x-2.appspot.com",
    messagingSenderId: "662587393048",
    appId: "1:662587393048:web:8b346f8e8917213c692f6d",
    measurementId: "G-H5GF6JCZD8"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  
  toast(`${payload.notification.title} : ${payload.notification.body}`);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  console.log("payload :", payload)

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
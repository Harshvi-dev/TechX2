import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getStorage } from "firebase/storage"
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from "firebase/database"
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

//Initialize firebase 
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
const database = getDatabase(app);
const db = getFirestore(app);
const messaging = getMessaging(app)



export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("NOTIFICATION PAYLOD RECEVI" , payload)
      
      resolve(payload);
    });
  });



export const requestFirebaseNotificationPermission = () =>
  new Promise((resolve, reject) => {
    Notification.requestPermission().then((permission) => {
      console.log("THIS IS THE PERMISSION", permission)
      if (permission === 'granted') {
        getToken(messaging, { vapidKey: 'BIFqCI_TQNSFSiRONxTfOvox6VmjuhrUogAU7MN9MmMI4wDf9SrkpLySJw6xTlQ1IF4cuhykQwJzh3vYo702Lm4' }).then((currentToken) => {
          if (currentToken) {
            resolve(currentToken);
            // Send the token to your server and update the UI if necessary
            // ...
          } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.');
            // ...
          }
        }).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
          // ...
        });
      }
    }).catch((error) => {
      console.log("ERROR CALLING", error)
    })
    // Notification.requestPermission()
    //   .then(() => messaging.getToken())
    //   .then((firebaseToken) => {
    //     resolve(firebaseToken);
    //   })
    //   .catch((err) => {
    //     console.log("MAIN PAGE ERROR",err)
    //     reject(err);
    //   });
  });

export { auth, provider, storage, database, db, messaging };
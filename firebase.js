import firebase from 'firebase';
const firebaseConfig = {
  apiKey: 'AIzaSyBVGvWFcJ07rszeZThnux97xeb7YGhBS_w',
  authDomain: 'whatsapp-2-9507f.firebaseapp.com',
  projectId: 'whatsapp-2-9507f',
  storageBucket: 'whatsapp-2-9507f.appspot.com',
  messagingSenderId: '948391766036',
  appId: '1:948391766036:web:e3fd9f66c2296aa5afdf01',
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };

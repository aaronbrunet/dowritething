import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: "dowritething-4c0f3.firebaseapp.com",
    projectId: "dowritething-4c0f3",
    storageBucket: "dowritething-4c0f3.appspot.com",
    messagingSenderId: "530471616269",
    appId: "1:530471616269:web:b98c7b996259f924243a44",
    measurementId: "G-19L5Y8YZGM"
  };
  // Initialize Firebase
firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const firestore = firebase.firestore();

export default firebase;
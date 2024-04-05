// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
//
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBxN0vsGBhM3FqDjUHmPGpjUX2KaJ8B28E',
  authDomain: 'gbudget-324.firebaseapp.com',
  projectId: 'gbudget-324',
  storageBucket: 'gbudget-324.appspot.com',
  messagingSenderId: '529488127922',
  appId: '1:529488127922:web:23999587328285a13326ab',
  measurementId: 'G-HS32S610HQ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

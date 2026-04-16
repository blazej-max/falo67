import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADm_OEOXZrMksHlYHlWkKQurHW5HBTDbc",
  authDomain: "falo-9525c.firebaseapp.com",
  projectId: "falo-9525c",
  storageBucket: "falo-9525c.firebasestorage.app",
  messagingSenderId: "192168193442",
  appId: "1:192168193442:web:41fac1a7520823b30816fb",
  measurementId: "G-Q8QNN3G6HQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


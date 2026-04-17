import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyADm_OEOXZrMksHlYHlWkKQurHW5HBTDbc",
  authDomain: "falo-9525c.firebaseapp.com",
  projectId: "falo-9525c",
  storageBucket: "falo-9525c.firebasestorage.app",
  messagingSenderId: "192168193442",
  appId: "1:192168193442:web:38fdc81df09f75da0816fb",
  measurementId: "G-J2ZNPMXNB6"
};

const app = initializeApp(firebaseConfig);

// 🔥 TO JEST KLUCZ
export const auth = getAuth(app);

// analytics (opcjonalne, nie psuje nic)
export const analytics = getAnalytics(app);
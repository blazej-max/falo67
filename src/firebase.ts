import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyADm_OEOXZrMksHlYHlwKQurHW5HBTDbc",
  authDomain: "falo-9525c.firebaseapp.com",
  projectId: "falo-9525c",
  storageBucket: "falo-9525c.firebasestorage.app",
  messagingSenderId: "192168193442",
  appId: "1:192168193442:web:41fac1a7520823b30816fb",
  measurementId: "G-Q8QNN3G6HQ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const analytics = getAnalytics(app);
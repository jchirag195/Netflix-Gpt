// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { Firebase_API_Key } from "./constant";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: Firebase_API_Key,
  authDomain: "netflix-gpt-c673c.firebaseapp.com",
  projectId: "netflix-gpt-c673c",
  storageBucket: "netflix-gpt-c673c.appspot.com",
  messagingSenderId: "1005586743605",
  appId: "1:1005586743605:web:6d44198e954cb6ff450c7c",
  measurementId: "G-JZ4TFCT3EC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
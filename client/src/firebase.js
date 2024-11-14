// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "budgetmate-68e52.firebaseapp.com",
  projectId: "budgetmate-68e52",
  storageBucket: "budgetmate-68e52.firebasestorage.app",
  messagingSenderId: "1023357841649",
  appId: "1:1023357841649:web:f7012895c7efac70337950",
  measurementId: "G-2LET497WRY",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDOwKQDJYftjR8vmEzF4klMeP8VLZW9yB8",
  authDomain: "stepintopython.firebaseapp.com",
  projectId: "stepintopython",
  storageBucket: "stepintopython.firebasestorage.app",
  messagingSenderId: "805215190705",
  appId: "1:805215190705:web:1590c0f86e90a1ad68ec90",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
export const auth = getAuth(app);

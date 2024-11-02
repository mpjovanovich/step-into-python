import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB27amjekMC2LQ9AfNlqRN5flrCfbiWaNg",
  authDomain: "coding-quiz-engine.firebaseapp.com",
  projectId: "coding-quiz-engine",
  storageBucket: "coding-quiz-engine.firebasestorage.app",
  messagingSenderId: "1075619314876",
  appId: "1:1075619314876:web:666fa15a1d048404d064b9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

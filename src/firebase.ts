import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import FIREBASE_CONFIG from "./firebase.config";

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);

// Initialize Firestore
export const db = getFirestore(app);
export const auth = getAuth(app);

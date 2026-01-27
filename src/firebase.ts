import FIREBASE_CONFIG from "@/firebase.config";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth, sendPasswordResetEmail } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);
const auth = getAuth(app);

const useEmulator = import.meta.env.DEV;
if (useEmulator) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

export { auth, db, sendPasswordResetEmail };

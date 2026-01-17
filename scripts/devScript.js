process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";

// This is a one-off script to help with development.
// It's source controlled just for convenience.

import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase
initializeApp({
  projectId: "stepintopython",
});

// DO NOT USE ACTUAL AUTH KEY IN ENV - You don't need it; emulator will handle
// it.
const auth = getAuth();
const db = getFirestore();

try {
  // // Add auth user
  //   const userRecord = await auth.createUser({
  //     email: email,
  //     emailVerified: false,
  //     password: password,
  //     displayName: displayName,
  //     disabled: false,
  //   });
  // // Add firestore user
  //   await db.collection("users").doc(userRecord.uid).set({
  //     email: email,
  //     name: displayName,
  //     section: section,
  //     completedExercises: [],
  //   });
  // // Update exercise
  // await db.collection("exercises").doc("00.00-test-exercise").update({
  //   template: "1?# Comment\n2?Code @@answer@@",
  // });
} catch (error) {
  console.error(error);
  process.exit(1);
}

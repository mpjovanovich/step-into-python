import admin from "firebase-admin";

process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";

admin.initializeApp({ projectId: "stepintopython" });

const db = admin.firestore();
const auth = admin.auth();

async function seedData() {
  console.log("🌱 Starting Seed...");

  try {
    // CREATE TEST AUTH USER
    let uid = "dev-user";
    let email = "dev@dev.com";
    let password = "devUser";
    let displayName = "Dev User";
    let section = "001";

    const userRecord = await auth.createUser({
      uid: uid,
      email: email,
      emailVerified: true,
      password: password,
      displayName: displayName,
      disabled: false,
    });
    console.log(`✅ User '${email}' created`);

    // SEED FIRESTORE USER
    await db.collection("users").doc(userRecord.uid).set({
      email: email,
      name: displayName,
      section: section,
      completedExercises: [],
    });
    console.log("✅ Firestore user seeded");

    // SEED FIRESTORE EXERCISES
    // TODO

    console.log("✅ Firestore exercises seeded");
  } catch (error) {
    if (error.code === "auth/email-already-exists") {
      console.log("⚠️ User already exists, skipping...");
    } else {
      console.error(error);
    }
  }
}

seedData();

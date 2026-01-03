import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

/*
 * This script requires the firebase emulator to be running.
 * Run `npm run firebase:emulate:firestore` to start the emulator.
 */
const projectId = "test-project";

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load local Firestore rules
const rules = readFileSync(join(__dirname, "firestore.rules"), "utf8");

// TODO: We need to port this to the new library after we get rid of firebaseui:
// https://firebase.google.com/docs/rules/unit-tests

// describe("firestore database", () => {
//   beforeAll(async () => {
//     // Load the local rules file before running tests
//     await loadFirestoreRules({ projectId, rules });
//   });

//   it("should deny all reads and writes", async () => {
//     const db = initializeTestApp({ projectId }).firestore();

//     // Test that read fails
//     await assertFails(db.collection("test").get());

//     // Test that write fails
//     await assertFails(db.collection("test").doc("testDoc").set({ test: true }));
//   });
// });

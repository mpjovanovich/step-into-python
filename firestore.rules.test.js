import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import fs from "fs";

/*
 * This script requires the firebase emulator to be running.
 * Run `npm run firebase:emulate:firestore` to start the emulator.
 * See: https://firebase.google.com/docs/rules/unit-tests
 */
const projectId = "test-project";

describe("firestore database", () => {
  let testEnv;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: projectId,
      firestore: {
        host: "127.0.0.1",
        port: 8080,
        rules: fs.readFileSync("firestore.rules", "utf8"),
      },
    });
  });

  describe("for exercises collection", () => {
    describe("for unauthenticated user", () => {
      let authContext;
      let db;

      beforeEach(async () => {
        await testEnv.clearFirestore();
        authContext = testEnv.unauthenticatedContext();
        db = authContext.firestore();
      });

      it("should deny reads", async () => {
        await assertFails(getDoc(doc(db, "exercises", "1")));
      });

      it("should deny writes", async () => {
        await assertFails(setDoc(doc(db, "exercises", "1"), { test: true }));
      });
    });

    describe("for authenticated user", () => {
      let authContext;
      let db;

      beforeEach(async () => {
        await testEnv.clearFirestore();
        authContext = testEnv.authenticatedContext("user1");
        db = authContext.firestore();
      });

      it("should allow reads", async () => {
        await assertSucceeds(getDoc(doc(db, "exercises", "1")));
      });

      it("should deny writes", async () => {
        await assertFails(setDoc(doc(db, "exercises", "1"), { test: true }));
      });
    });
  });

  describe("for users collection", () => {
    describe("for unauthenticated user", () => {
      let authContext;
      let db;

      beforeEach(async () => {
        await testEnv.clearFirestore();
        authContext = testEnv.unauthenticatedContext();
        db = authContext.firestore();
      });

      it("should deny reads", async () => {
        await assertFails(getDoc(doc(db, "users", "1")));
      });

      it("should deny writes", async () => {
        await assertFails(setDoc(doc(db, "users", "1"), { test: true }));
      });
    });

    describe("for authenticated user", () => {
      let authContext;
      let db;

      beforeEach(async () => {
        await testEnv.clearFirestore();
        authContext = testEnv.authenticatedContext("user1");
        db = authContext.firestore();
      });

      it("should deny reads to other users", async () => {
        await assertFails(getDoc(doc(db, "users", "user2")));
      });

      it("should deny writes to other users", async () => {
        await assertFails(setDoc(doc(db, "users", "user2"), { test: true }));
      });

      it("should allow reads to own document", async () => {
        await assertSucceeds(getDoc(doc(db, "users", "user1")));
      });

      it("should not allow updates to own document if field is not completedExercises", async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const adminDb = context.firestore();
          await setDoc(doc(adminDb, "users", "user1"), { test: true });
        });
        await assertFails(
          updateDoc(doc(db, "users", "user1"), { test: false })
        );
      });

      it("should allow updates to own document if field is completedExercises", async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const adminDb = context.firestore();
          await setDoc(doc(adminDb, "users", "user1"), {
            completedExercises: ["exercise1"],
          });
        });
        await assertSucceeds(
          updateDoc(doc(db, "users", "user1"), {
            completedExercises: ["exercise1", "exercise2"],
          })
        );
      });
    });
  });
});

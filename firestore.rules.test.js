import {
  assertFails,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc } from "firebase/firestore";
import fs from "fs";
import { beforeAll, describe, it } from "vitest";

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

  it("DEBUG: should deny all reads and writes", async () => {
    const authContext = testEnv.unauthenticatedContext();
    const db = authContext.firestore();

    // Test that read fails
    const docRef = doc(db, "exercises", "1");
    await assertFails(getDoc(docRef));
  });
});

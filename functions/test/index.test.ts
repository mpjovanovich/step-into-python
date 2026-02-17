// import firebaseFunctionsTest from "firebase-functions-test";
// import { describe, expect, it } from "vitest";
// import { test } from "../src/index";

// const { wrap } = firebaseFunctionsTest();

// describe("checks user answers", () => {
//   let wrapped;
//   beforeAll(() => {
//     wrapped = wrap(test);
//   });

//   it("gives null result for unanswered answer", async () => {
//     const result = await wrapped({
//       auth: {
//         uid: "admin",
//         // email: "test@test.com",
//         // displayName: "Test User",
//       },
//     });
//     expect(result).toBe(1);
//   });
//   it("returns true for dummy test", () => {
//     expect(true).toBe(true);
//   });
// });

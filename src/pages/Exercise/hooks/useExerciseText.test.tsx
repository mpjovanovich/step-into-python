// const EXERCISE_START_DESCRIPTION_TEXT =
//   "In this exercise you will complete a Python program step by step.";
// const EXERCISE_FINAL_STEP_DESCRIPTION_TEXT = "Your program is complete.";
// const EXERCISE_COMPLETE_STEP_DESCRIPTION_TEXT = "Exercise Complete!";
// const TEST_DESCRIPTION = "TEST-DESCRIPTION";
// const TEST_INSTRUCTIONS = "TEST-INSTRUCTIONS";

// // These should be very basic "contains [sometext]" tests to sanity check output based on the current step.
// describe("exercise description text", () => {
//   it("on start step: contains exercise start text", () => {
//     const data = getDescriptionData(0, 1, TEST_DESCRIPTION);

//     expect(data.type).toBe("start");
//     expect(data.text).toContain(EXERCISE_START_DESCRIPTION_TEXT);
//     expect(data.text).not.toContain(TEST_DESCRIPTION);
//     expect(data.text).not.toContain(EXERCISE_FINAL_STEP_DESCRIPTION_TEXT);
//     expect(data.text).not.toContain(EXERCISE_COMPLETE_STEP_DESCRIPTION_TEXT);
//   });

//   it("on exercise step: contains exercise description text", () => {
//     const data = getDescriptionData(1, 2, TEST_DESCRIPTION);

//     expect(data.type).toBe("regular");
//     expect(data.text).toContain(TEST_DESCRIPTION);
//     expect(data.text).not.toContain(EXERCISE_START_DESCRIPTION_TEXT);
//   });

//   it("on final step: contains final step text", () => {
//     const data = getDescriptionData(2, 1, TEST_DESCRIPTION);

//     expect(data.type).toBe("final");
//     expect(data.text).toContain(EXERCISE_FINAL_STEP_DESCRIPTION_TEXT);
//     expect(data.text).not.toContain(TEST_DESCRIPTION);
//   });

//   it("on complete step: contains complete text", () => {
//     const data = getDescriptionData(3, 1, TEST_DESCRIPTION);

//     expect(data.type).toBe("complete");
//     expect(data.text).toContain(EXERCISE_COMPLETE_STEP_DESCRIPTION_TEXT);
//     expect(data.text).not.toContain(TEST_DESCRIPTION);
//   });
// });

// describe("exercise instructions text", () => {
//   it("on start step: contains next instruction", () => {
//     const data = getInstructionsData(0, 1, "");

//     expect(data.type).toBe("next");
//     expect(data.text).toContain("Click Next to continue");
//   });

//   it("on exercise step with instructions: contains custom instructions", () => {
//     const data = getInstructionsData(1, 2, TEST_INSTRUCTIONS);

//     expect(data.type).toBe("custom");
//     expect(data.text).toContain(TEST_INSTRUCTIONS);
//   });

//   it("on final step: contains submit instruction", () => {
//     const data = getInstructionsData(2, 1, TEST_INSTRUCTIONS);

//     expect(data.type).toBe("submit");
//     expect(data.text).toContain("Click Submit");
//     expect(data.text).not.toContain(TEST_INSTRUCTIONS);
//   });

//   it("on complete step: contains home instruction", () => {
//     const data = getInstructionsData(3, 1, TEST_INSTRUCTIONS);

//     expect(data.type).toBe("home");
//     expect(data.text).toContain("Click Home");
//     expect(data.text).not.toContain(TEST_INSTRUCTIONS);
//   });
// });

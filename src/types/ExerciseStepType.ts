/* ********************************************************
 * STEP DETAILS
 ******************************************************** */
// We always have three "artificial" steps no matter how many steps are in the
// template.  E.g.: In a template with three steps, the following steps are
// expected:

// Step 0: Artificial - "start screen" with basic instructions.
// Step 1: Template - First step
// Step 2: Template - Second step
// Step 3: Template - Third (final) step
// Step 4: Artificial - Submit button after completing all steps.

// Note that "finalStep" is the final step number from the template, so in
// this case it would be 3.

/**
 * Represents the different types of steps in an exercise flow.
 * - START: The initial step (step 0)
 * - EXERCISE: Regular exercise steps (step 1 through finalStep)
 * - SUBMIT: The submit step (finalStep + 1)
 */
export const ExerciseStepType = {
  START: "START",
  EXERCISE: "EXERCISE",
  SUBMIT: "SUBMIT",
} as const;

export type ExerciseStepType =
  (typeof ExerciseStepType)[keyof typeof ExerciseStepType];

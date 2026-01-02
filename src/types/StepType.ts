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
// Step 5: Artificial - Complete screen with link to home.

// Note that "finalStep" is the final step number from the template, so in
// this case it would be 3.

/**
 * Represents the different types of steps in an exercise flow.
 * - START: The initial step (step 0)
 * - EXERCISE: Regular exercise steps (step 1 through finalStep)
 * - SUBMIT: The submit step (finalStep + 1)
 * - COMPLETE: The completion step (finalStep + 2 and beyond)
 */
export const StepType = {
  START: "START",
  EXERCISE: "EXERCISE",
  SUBMIT: "SUBMIT",
  COMPLETE: "COMPLETE",
} as const;

export type StepType = (typeof StepType)[keyof typeof StepType];

export function getStepType(currentStep: number, finalStep: number): StepType {
  if (currentStep === 0) {
    return StepType.START;
  }
  if (currentStep >= 1 && currentStep <= finalStep) {
    return StepType.EXERCISE;
  }
  if (currentStep === finalStep + 1) {
    return StepType.SUBMIT;
  }
  if (currentStep > finalStep + 1) {
    return StepType.COMPLETE;
  }
  throw new Error(`Invalid step number: ${currentStep}`);
}

import { type CodeForStep } from "../../../domain/templateParser";
import { type CurrentStep } from "../../../types/CurrentStep";
import { type Exercise } from "../../../types/Exercise";
import { StepType } from "../../../types/StepType";

export function getCurrentStepProperties(
  codeForStep: CodeForStep | null,
  exercise: Exercise | null,
  step: number,
  finalStep: number
): CurrentStep {
  return {
    code: codeForStep?.code ?? "",
    copyCode: codeForStep?.copyCode ?? "",
    answers: codeForStep?.answers ?? [],
    descriptions: exercise?.descriptions[step] ?? "",
    instructions: exercise?.instructions[step] ?? "",
    stepType: getStepType(step, finalStep),
  };
}

function getStepType(currentStep: number, finalStep: number): StepType {
  if (currentStep === 0) {
    return StepType.START;
  }
  if (currentStep >= 1 && currentStep <= finalStep) {
    return StepType.EXERCISE;
  }
  if (currentStep === finalStep + 1) {
    return StepType.SUBMIT;
  }
  if (currentStep === finalStep + 2) {
    return StepType.COMPLETE;
  }
  throw new Error(`Invalid step number: ${currentStep}`);
}

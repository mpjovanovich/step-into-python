import { type CodeForStep } from "../../../domain/templateParser";
import { type CurrentStep } from "../../../types/CurrentStep";
import { type Exercise } from "../../../types/Exercise";
import { ExerciseStepType } from "../../../types/ExerciseStepType";

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

function getStepType(currentStep: number, finalStep: number): ExerciseStepType {
  if (currentStep === 0) {
    return ExerciseStepType.START;
  }
  if (currentStep >= 1 && currentStep <= finalStep) {
    return ExerciseStepType.EXERCISE;
  }
  if (currentStep === finalStep + 1) {
    return ExerciseStepType.SUBMIT;
  }
  if (currentStep === finalStep + 2) {
    return ExerciseStepType.COMPLETE;
  }
  throw new Error(`Invalid step number: ${currentStep}`);
}

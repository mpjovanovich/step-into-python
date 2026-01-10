import { StepType } from "../../../types/StepType";

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
  if (currentStep === finalStep + 2) {
    return StepType.COMPLETE;
  }
  throw new Error(`Invalid step number: ${currentStep}`);
}

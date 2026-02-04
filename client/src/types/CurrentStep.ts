import { ExerciseStepType } from "@/types/ExerciseStepType";

export interface CurrentStep {
  code: string;
  copyCode: string;
  answers: string[];
  descriptions: string;
  instructions: string;
  stepType: ExerciseStepType;
}

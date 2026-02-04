export const ExerciseButtonType = {
  PREVIOUS: "PREVIOUS",
  NEXT: "NEXT",
  SUBMIT: "SUBMIT",
} as const;

export type ExerciseButtonType =
  (typeof ExerciseButtonType)[keyof typeof ExerciseButtonType];

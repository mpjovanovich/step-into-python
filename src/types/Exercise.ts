export interface Exercise {
  id: string;
  order: number;
  course: string;
  title: string;
  descriptions: Record<number, string>;
  instructions: Record<number, string>;
  template: string;
}

export type ExerciseState =
  | "LOADING"
  | "STEP_COMPLETE"
  | "STEP_INCOMPLETE"
  | "SUBMITTING"
  | "COMPLETED"
  | "ERROR";

import { useState } from "react";
import { Exercise } from "../types/Exercise";

interface ExerciseState {
  step: number;
  exercise: Exercise | null;
  currentTemplate: string;
  userAnswers: string[];
  correctAnswers: string[];
  solvedAnswers: (boolean | null)[];
}

interface ExerciseActions {
  setStep: (step: number) => void;
  setExercise: (exercise: Exercise | null) => void;
  setCurrentTemplate: (template: string) => void;
  setUserAnswers: (answers: string[]) => void;
  setCorrectAnswers: (answers: string[]) => void;
  setSolvedAnswers: (solved: (boolean | null)[]) => void;
}

export function useExerciseState(): [ExerciseState, ExerciseActions] {
  const [state, setState] = useState<ExerciseState>({
    step: 0,
    exercise: null,
    currentTemplate: "",
    userAnswers: [],
    correctAnswers: [],
    solvedAnswers: [],
  });

  const actions: ExerciseActions = {
    setStep: (step) => setState((prev) => ({ ...prev, step })),
    setExercise: (exercise) => setState((prev) => ({ ...prev, exercise })),
    setCurrentTemplate: (currentTemplate) =>
      setState((prev) => ({ ...prev, currentTemplate })),
    setUserAnswers: (userAnswers) =>
      setState((prev) => ({ ...prev, userAnswers })),
    setCorrectAnswers: (correctAnswers) =>
      setState((prev) => ({ ...prev, correctAnswers })),
    setSolvedAnswers: (solvedAnswers) =>
      setState((prev) => ({ ...prev, solvedAnswers })),
  };

  return [state, actions];
}

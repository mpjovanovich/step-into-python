import { useEffect, useState } from "react";
import { type User } from "../types/User";

interface UseExerciseParams {
  exerciseId: string | undefined;
  user: User | null;
}

export type ExerciseLoadState = "LOADING" | "COMPLETE" | "ERROR";

interface UseExerciseReturn {
  exerciseLoadState: ExerciseLoadState;
}

export function useExercise({
  exerciseId,
}: //   user,
UseExerciseParams): UseExerciseReturn {
  const [exerciseLoadState, setExerciseLoadState] =
    useState<ExerciseLoadState>("LOADING");

  useEffect(() => {
    // TODO: Fetch the exercise from the database
    setExerciseLoadState("COMPLETE");
  }, [exerciseId]);

  return {
    exerciseLoadState,
  };
}

import { useContext } from "react";
import { type ExerciseCache } from "../cache/exerciseCache";
import { ExerciseCacheContext } from "../providers/ExerciseCacheContext";

export function useExerciseCache(): ExerciseCache {
  const context = useContext(ExerciseCacheContext);
  if (context === undefined) {
    throw new Error(
      "useExerciseCache must be used within an ExerciseCacheProvider"
    );
  }
  return context;
}

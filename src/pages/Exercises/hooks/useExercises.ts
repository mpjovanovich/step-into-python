import { useEffect, useState } from "react";
import { createExerciseCache } from "../../../cache/exerciseCache";
import { exerciseService } from "../../../services/exerciseService";
import { type Exercise } from "../../../types/Exercise";

interface ExercisesState {
  exercises: Exercise[] | null;
  error: Error | null;
}

export function useExercises(userId: string): ExercisesState {
  const exerciseCache = createExerciseCache(exerciseService, localStorage);
  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const exercises = await exerciseCache.fetchAll();
        setExercises(exercises);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch exercises")
        );
        setExercises(null);
      }
    };

    fetchExercises();
  }, [userId]);

  return { exercises, error };
}

import { useEffect, useMemo, useState } from "react";
import { createExerciseCache } from "../../../cache/exerciseCache";
import { getStepCount } from "../../../domain/templateParser";
import { exerciseService } from "../../../services/exerciseService";
import { type Exercise } from "../../../types/Exercise";

interface ExerciseState {
  exercise: Exercise | null;
  finalStep: number;
  error: Error | null;
}

export function useExercise(exerciseId: string): ExerciseState {
  const exerciseCache = createExerciseCache(exerciseService, localStorage);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const finalStep = useMemo(() => {
    if (!exercise) return 0;
    return getStepCount(exercise.template);
  }, [exercise]);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const exercise = await exerciseCache.fetchById(exerciseId!);
        if (exercise) {
          setExercise(exercise);
        } else {
          setError(new Error("Exercise not found."));
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error
            : new Error("Failed to fetch exercise.")
        );
      }
    };
    fetchExercise();
  }, [exerciseId]);

  return { exercise, finalStep, error };
}

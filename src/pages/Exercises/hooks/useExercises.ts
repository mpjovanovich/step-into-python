import { useEffect, useState } from "react";
import { useExerciseCache } from "../../../hooks/useExerciseCache";
import { type Exercise } from "../../../types/Exercise";

interface ExercisesState {
  exercises: Exercise[] | null;
}

export function useExercises(userId: string): ExercisesState {
  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const exerciseCache = useExerciseCache();

  useEffect(() => {
    const fetchExercises = async () => {
      const exercises = await exerciseCache.fetchAll();
      setExercises(exercises);
    };

    fetchExercises();
  }, [userId, exerciseCache]);

  return { exercises };
}

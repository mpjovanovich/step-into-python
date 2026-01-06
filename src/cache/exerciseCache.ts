import { type ExerciseService } from "../services/exerciseService";
import { type Exercise } from "../types/Exercise";

// If we want to genericize this later we can, but for now YAGNI
export interface ExerciseCache extends ExerciseService {
  clear(): void;
}

const EXERCISES_KEY = "exercises";

export function createExerciseCache(
  exerciseService: ExerciseService,
  storage: Storage
): ExerciseCache {
  const getSerializedExercises = () => {
    const exercises = new Map<string, Exercise>(
      JSON.parse(storage.getItem(EXERCISES_KEY) ?? "{}")
    );
    return exercises;
  };

  const setSerializedExercises = (exercises: Map<string, Exercise>) => {
    storage.setItem(
      EXERCISES_KEY,
      JSON.stringify(Array.from(exercises.entries()))
    );
  };

  const loadExercises = async () => {
    const exercises = await exerciseService.fetchAll();
    const exercisesMap = new Map(
      exercises.map((exercise) => [exercise.id, exercise])
    );
    setSerializedExercises(exercisesMap);
  };

  return {
    fetchById: async (exerciseId: string) => {
      if (!storage.getItem(EXERCISES_KEY)) {
        await loadExercises();
      }
      const exercises = getSerializedExercises();
      return exercises.get(exerciseId) ?? null;
    },

    fetchAll: async () => {
      if (!storage.getItem(EXERCISES_KEY)) {
        await loadExercises();
      }
      return Array.from(getSerializedExercises().values());
    },

    clear: () => {
      storage.removeItem(EXERCISES_KEY);
    },
  };
}

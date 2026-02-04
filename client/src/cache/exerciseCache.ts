import { type Exercise } from "@/types/Exercise";
import type { ExerciseService } from "@/types/ExerciseService";
import { type ServiceResponse } from "@/types/ServiceResponse";

// If we want to genericize this later we can, but for now YAGNI
export interface ExerciseCache extends ExerciseService {
  clearCache(): void;
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

  const loadExercises = async (): Promise<ServiceResponse<Exercise[]>> => {
    const exercises = await exerciseService.fetchAll();
    if (exercises.error) {
      return { data: null, error: exercises.error };
    }

    const exercisesMap = new Map(
      exercises.data?.map((exercise) => [exercise.id, exercise]) ?? []
    );

    setSerializedExercises(exercisesMap);

    return { data: exercises.data ?? [], error: null };
  };

  return {
    fetchById: async (
      exerciseId: string
    ): Promise<ServiceResponse<Exercise>> => {
      if (!storage.getItem(EXERCISES_KEY)) {
        const exercises = await loadExercises();
        if (exercises.error) {
          return { data: null, error: exercises.error };
        }
      }

      const exercises = getSerializedExercises();
      const exercise = exercises.get(exerciseId);
      if (!exercise) {
        return { data: null, error: "Exercise not found." };
      }

      return { data: exercise, error: null };
    },

    fetchAll: async (): Promise<ServiceResponse<Exercise[]>> => {
      if (!storage.getItem(EXERCISES_KEY)) {
        const exercises = await loadExercises();
        if (exercises.error) {
          return { data: null, error: exercises.error };
        }
      }
      return {
        data: Array.from(getSerializedExercises().values()),
        error: null,
      };
    },

    clearCache: () => {
      storage.removeItem(EXERCISES_KEY);
    },
  };
}

import {
  type ExerciseService,
  exerciseService,
} from "@/services/exerciseService";
import { type Exercise } from "@/types/Exercise";
import { type ServiceResponse } from "@/types/ServiceResponse";

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
    fetchById: async (exerciseId: string): Promise<ServiceResponse<Exercise>> => {
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
      return { data: Array.from(getSerializedExercises().values()), error: null };
    },

    clear: () => {
      storage.removeItem(EXERCISES_KEY);
    },
  };
}

let exerciseCache: ExerciseCache | null = null;

export function getExerciseCache(
  exerciseServiceParam?: ExerciseService,
  storageParam?: Storage
): ExerciseCache {
  if (!exerciseCache) {
    const service = exerciseServiceParam ?? exerciseService;
    const storage =
      storageParam ??
      (typeof window !== "undefined" ? window.localStorage : ({} as Storage));
    exerciseCache = createExerciseCache(service, storage);
  }
  return exerciseCache;
}

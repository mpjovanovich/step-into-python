import { useMemo, type PropsWithChildren } from "react";
import {
  createExerciseCache,
  type ExerciseCache,
} from "../cache/exerciseCache";
import { exerciseService } from "../services/exerciseService";
import { ExerciseCacheContext } from "./ExerciseCacheContext";

export const ExerciseCacheProvider = ({ children }: PropsWithChildren) => {
  // Create the cache instance when the provider mounts
  // At this point we're guaranteed to be in the browser, so localStorage is available
  const exerciseCache = useMemo<ExerciseCache>(() => {
    return createExerciseCache(exerciseService, window.localStorage);
  }, []);

  return (
    <ExerciseCacheContext.Provider value={exerciseCache}>
      {children}
    </ExerciseCacheContext.Provider>
  );
};

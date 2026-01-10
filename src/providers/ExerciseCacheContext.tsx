import { createContext } from "react";
import { type ExerciseCache } from "../cache/exerciseCache";

export const ExerciseCacheContext = createContext<ExerciseCache | undefined>(
  undefined
);

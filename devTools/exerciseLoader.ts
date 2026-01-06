// devTools/exerciseLoader.ts
import type { Exercise } from "../src/types/Exercise";
import exerciseData from "./data/dev-exercise.json";

export const fetchDevExercise = (): Exercise => {
  return { ...exerciseData, id: "dev-exercise" } as Exercise;
};

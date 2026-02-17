import type { Exercise } from "../src/types/Exercise";
import { type ServiceResponse } from "../src/types/ServiceResponse";
import exerciseData from "./data/dev-exercise.json";

// To load the exercise data from the JSON file:
// Go to an exercise page and change the exercise id to "debug" in the URL
export async function fetchDevExercise(): Promise<ServiceResponse<Exercise>> {
  return {
    data: { ...exerciseData, id: "dev-exercise" } as Exercise,
    error: null,
  };
}

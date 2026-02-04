import type { Exercise } from "./Exercise";
import type { ServiceResponse } from "./ServiceResponse";

export interface ExerciseService {
  clearCache(): void;
  fetchById(exerciseId: string): Promise<ServiceResponse<Exercise>>;
  fetchAll(): Promise<ServiceResponse<Exercise[]>>;
}

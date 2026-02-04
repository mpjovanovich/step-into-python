import type { ServiceResponse } from "./ServiceResponse";
import type { User } from "./User";

export interface UserService {
  completeExercise(
    userId: string,
    exerciseId: string
  ): Promise<ServiceResponse<null>>;
  getUser(userId: string): Promise<ServiceResponse<User | null>>;
}

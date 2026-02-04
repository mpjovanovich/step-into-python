import { db } from "@/firebase";
import { ErrorSeverity } from "@/types/ErrorSeverity";
import { type ServiceResponse } from "@/types/ServiceResponse";
import { type User } from "@/types/User";
import { type UserService } from "@/types/UserService";
import {
  Firestore,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { errorService } from "./errorService";

function createUserService(db: Firestore): UserService {
  const userService = {
    async completeExercise(
      userId: string,
      exerciseId: string
    ): Promise<ServiceResponse<null>> {
      try {
        await updateDoc(doc(db, "users", userId), {
          completedExercises: arrayUnion(exerciseId),
        });
        return { data: null, error: null };
      } catch (error) {
        await errorService.logError(error as Error, ErrorSeverity.ERROR, {
          location: "userService.completeExercise",
          userId,
          exerciseId,
        });
        return { data: null, error: "Failed to complete exercise." };
      }
    },

    async getUser(userId: string): Promise<ServiceResponse<User | null>> {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          return {
            data: { ...userDoc.data(), id: userDoc.id } as User,
            error: null,
          };
        } else {
          await errorService.logError(
            new Error(`user not found`),
            ErrorSeverity.ERROR,
            { location: "userService.getUser", userId }
          );
          return { data: null, error: "User not found." };
        }
      } catch (error) {
        await errorService.logError(error as Error, ErrorSeverity.ERROR, {
          location: "userService.getUser",
          userId,
        });
        return { data: null, error: "Failed to fetch user." };
      }
    },
  };

  return userService;
}

export const userService = createUserService(db);

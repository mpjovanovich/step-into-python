import {
  Firestore,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import type { User } from "../types/User";

export interface UserService {
  completeExercise(userId: string, exerciseId: string): Promise<void>;
  getUser(userId: string): Promise<User | null>;
}

function createUserService(db: Firestore): UserService {
  const userService = {
    async completeExercise(userId: string, exerciseId: string): Promise<void> {
      await updateDoc(doc(db, "users", userId), {
        completedExercises: arrayUnion(exerciseId),
      });
    },

    async getUser(userId: string): Promise<User | null> {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return { ...userDoc.data(), id: userDoc.id } as User;
      }
      return null;
    },
  };

  return userService;
}

export const userService = createUserService(db);

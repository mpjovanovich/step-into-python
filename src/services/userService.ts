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
  fetchById(userId: string): Promise<User | null>;
}

function createUserService(db: Firestore): UserService {
  const userService = {
    async completeExercise(userId: string, exerciseId: string): Promise<void> {
      await updateDoc(doc(db, "users", userId), {
        completedExercises: arrayUnion(exerciseId),
      });
    },

    async fetchById(userId: string): Promise<User | null> {
      const userDocRef = doc(db, "users", userId);
      const snapshot = await getDoc(userDocRef);
      if (snapshot.exists()) {
        return { ...snapshot.data(), id: snapshot.id } as User;
      }
      return null;
    },
  };

  return userService;
}

export const userService = createUserService(db);

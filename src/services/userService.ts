import {
  Firestore,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import type { User } from "../types/User";

export interface UserService {
  completeExercise(userId: string, exerciseId: string): Promise<void>;

  subscribeToUser(
    userId: string,
    onUser: (user: User | null) => void
  ): () => void;
}

function createUserService(db: Firestore): UserService {
  const userService = {
    async completeExercise(userId: string, exerciseId: string): Promise<void> {
      await updateDoc(doc(db, "users", userId), {
        completedExercises: arrayUnion(exerciseId),
      });
    },

    subscribeToUser(
      userId: string,
      onUser: (user: User | null) => void
    ): () => void {
      const userDocRef = doc(db, "users", userId);
      return onSnapshot(userDocRef, (snapshot) => {
        let user: User | null = null;
        if (snapshot.exists()) {
          user = { ...snapshot.data(), id: snapshot.id } as User;
        }
        onUser(user);
      });
    },
  };

  return userService;
}

export const userService = createUserService(db);

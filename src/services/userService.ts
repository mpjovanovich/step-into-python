import {
  Firestore,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import type { User } from "../types/User";

export interface UserService {
  completeExercise(userId: string, exerciseId: string): Promise<void>;

  subscribeToUser(
    email: string,
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
      email: string,
      onUser: (user: User | null) => void
    ): () => void {
      const q = query(collection(db, "users"), where("email", "==", email));
      return onSnapshot(q, (snapshot) => {
        let user: User | null = null;
        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          user = { ...userDoc.data(), id: userDoc.id } as User;
        }
        onUser(user);
      });
    },
  };

  return userService;
}

export const userService = createUserService(db);

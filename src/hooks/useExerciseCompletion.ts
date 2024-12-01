import { getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { User } from "../types/User";

export function useExerciseCompletion() {
  const completeExercise = async (user: User, exerciseId: string) => {
    if (!user) return;

    const db = getFirestore();
    await updateDoc(doc(db, "users", user.id), {
      completedExercises: arrayUnion(exerciseId),
    });
  };

  return { completeExercise };
}

import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Exercise } from "../types/Exercise";

export interface ExerciseService {
  fetchById(exerciseId: string): Promise<Exercise | null>;
  fetchByCourse(course: string): Promise<Exercise[]>;
}

function createExerciseService(db: Firestore): ExerciseService {
  const exerciseService = {
    async fetchById(exerciseId: string): Promise<Exercise | null> {
      const exerciseRef = doc(db, "exercises", exerciseId);
      const snap = await getDoc(exerciseRef);
      if (!snap.exists()) {
        return null;
      }
      return { ...snap.data(), id: snap.id } as Exercise;
    },

    async fetchByCourse(course: string): Promise<Exercise[]> {
      const q = query(
        collection(db, "exercises"),
        where("course", "==", course),
        orderBy("order")
      );
      const snapshot = await getDocs(q);
      const exercises: Exercise[] = [];
      snapshot.docs.forEach((doc) => {
        exercises.push({ ...doc.data(), id: doc.id } as Exercise);
      });
      return exercises;
    },
  };

  return exerciseService;
}

export const exerciseService = createExerciseService(db);

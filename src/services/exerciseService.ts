import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  type DocumentData,
  type DocumentSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Exercise } from "../types/Exercise";

export interface ExerciseService {
  fetchById(exerciseId: string): Promise<Exercise | null>;
  fetchAll(): Promise<Exercise[]>;
}

function createExercise(doc: DocumentSnapshot<DocumentData>): Exercise {
  // Firestore doesn't include the id as part of the document, so we have to manually add it.
  // We also parse the template into an array of strings by splitting on newlines.
  const template = doc.data()?.template?.split("\n") ?? [];
  return { ...doc.data(), template, id: doc.id } as Exercise;
}

function createExerciseService(db: Firestore): ExerciseService {
  const exerciseService = {
    async fetchById(exerciseId: string): Promise<Exercise | null> {
      const exerciseRef = doc(db, "exercises", exerciseId);
      const snap = await getDoc(exerciseRef);
      if (!snap.exists()) {
        return null;
      }
      return createExercise(snap);
    },

    async fetchAll(): Promise<Exercise[]> {
      const q = query(collection(db, "exercises"), orderBy("order"));
      const snapshot = await getDocs(q);
      const exercises: Exercise[] = [];
      snapshot.docs.forEach((doc) => {
        exercises.push(createExercise(doc));
      });
      return exercises;
    },
  };

  return exerciseService;
}

export const exerciseService = createExerciseService(db);

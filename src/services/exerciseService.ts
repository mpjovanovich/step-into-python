import { createExerciseCache } from "@/cache/exerciseCache";
import { db } from "@/firebase";
import { errorService } from "@/services/errorService";
import { ErrorSeverity } from "@/types/ErrorSeverity";
import { type Exercise } from "@/types/Exercise";
import { type ServiceResponse } from "@/types/ServiceResponse";
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

export interface ExerciseService {
  fetchById(exerciseId: string): Promise<ServiceResponse<Exercise>>;
  fetchAll(): Promise<ServiceResponse<Exercise[]>>;
}

function createExercise(doc: DocumentSnapshot<DocumentData>): Exercise {
  // Firestore doesn't include the id as part of the document, so we have to manually add it.
  // We also parse the template into an array of strings by splitting on newlines.
  const template = doc.data()?.template?.split("\n") ?? [];
  return { ...doc.data(), template, id: doc.id } as Exercise;
}

function createExerciseService(db: Firestore): ExerciseService {
  const exerciseService = {
    async fetchByIdFromDatabase(exerciseId: string): Promise<ServiceResponse<Exercise>> {
      const exerciseRef = doc(db, "exercises", exerciseId);
      const snap = await getDoc(exerciseRef);
      if (!snap.exists()) {
        await errorService.logError(new Error(`exercise not found`), ErrorSeverity.WARNING, { location: "exerciseService.fetchByIdFromDatabase", exerciseId });
        return { data: null, error: "Exercise not found" };
      }
      return { data: createExercise(snap), error: null };
    },

    async fetchDevExercise(): Promise<ServiceResponse<Exercise>> {
      try {
        const { fetchDevExercise } =
          await import("../../devTools/exerciseLoader");
        return { data: fetchDevExercise(), error: null };
      } catch (error) {
        return { data: null, error: error as string };
      }
    },

    async fetchById(exerciseId: string): Promise<ServiceResponse<Exercise>> {
      if (import.meta.env.DEV && exerciseId === "debug") {
        return this.fetchDevExercise();
      }
      return await this.fetchByIdFromDatabase(exerciseId);
    },

    async fetchAll(): Promise<ServiceResponse<Exercise[]>> {
      try {
        const q = query(collection(db, "exercises"), orderBy("order"));
        const snapshot = await getDocs(q);
        const exercises: Exercise[] = [];
        snapshot.docs.forEach((doc) => {
          exercises.push(createExercise(doc));
        });
        return { data: exercises, error: null };
      } catch (error) {
        await errorService.logError(error as Error, ErrorSeverity.ERROR);
        return { data: null, error: "Failed to fetch exercises." };
      }
    },
  };

  return exerciseService;
}

// Check whether to use cache using env variable
const cacheEnabled: boolean = import.meta.env.VITE_DISABLE_CACHING !== 'true';
export const exerciseService = cacheEnabled ? createExerciseCache(createExerciseService(db), localStorage) : createExerciseService(db);
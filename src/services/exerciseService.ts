// import {
//   Firestore,
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   orderBy,
//   query,
//   where,
// } from "firebase/firestore";
// import type { Exercise } from "../types/Exercise";

// export interface ExerciseService {
//   fetchById(exerciseId: string): Promise<Exercise | null>;
//   fetchByCourse(course: string): Promise<Exercise[]>;
// }

// /**
//  * Creates an exercise service bound to a Firestore instance.
//  * This factory pattern makes testing easy - inject a mock Firestore.
//  */
// export function createExerciseService(db: Firestore): ExerciseService {
//   return {
//     async fetchById(exerciseId: string): Promise<Exercise | null> {
//       const exerciseRef = doc(db, "exercises", exerciseId);
//       const snap = await getDoc(exerciseRef);
//       if (!snap.exists()) return null;
//       return { ...snap.data(), id: snap.id } as Exercise;
//     },

//     async fetchByCourse(course: string): Promise<Exercise[]> {
//       const q = query(
//         collection(db, "exercises"),
//         where("course", "==", course),
//         orderBy("order")
//       );
//       const snapshot = await getDocs(q);
//       return snapshot.docs.map(
//         (doc) => ({ ...doc.data(), id: doc.id } as Exercise)
//       );
//     },
//   };
// }

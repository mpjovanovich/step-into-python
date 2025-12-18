// import {
//   Firestore,
//   doc,
//   updateDoc,
//   arrayUnion,
//   collection,
//   query,
//   where,
//   onSnapshot,
// } from "firebase/firestore";
// import type { User } from "../types/User";

// export interface UserService {
//   completeExercise(userId: string, exerciseId: string): Promise<void>;
//   subscribeToUser(
//     email: string,
//     onUser: (user: User | null) => void
//   ): () => void;
// }

// export function createUserService(db: Firestore): UserService {
//   return {
//     async completeExercise(userId: string, exerciseId: string): Promise<void> {
//       await updateDoc(doc(db, "users", userId), {
//         completedExercises: arrayUnion(exerciseId),
//       });
//     },

//     subscribeToUser(
//       email: string,
//       onUser: (user: User | null) => void
//     ): () => void {
//       const q = query(
//         collection(db, "users"),
//         where("email", "==", email)
//       );
//       return onSnapshot(q, (snapshot) => {
//         if (!snapshot.empty) {
//           const userDoc = snapshot.docs[0];
//           onUser({ ...userDoc.data(), id: userDoc.id } as User);
//         } else {
//           onUser(null);
//         }
//       });
//     },
//   };
// }

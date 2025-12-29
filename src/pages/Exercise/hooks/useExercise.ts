// import { useEffect, useMemo, useState } from "react";
// import { createExerciseService } from "../../../services/exerciseService";
// import { db } from "../../../firebase";
// import type { Exercise, ExerciseState } from "../../../types/Exercise";

// // useExercise.ts
// export function useExercise(exerciseId: string | undefined) {
//   const [exercise, setExercise] = useState<ExerciseType | null>(null);
//   const [state, setState] = useState<ExerciseState>("LOADING");

//   // Memoize services
//   const exerciseService = useMemo(() => createExerciseService(db), []);

//   useEffect(() => {
//     if (!exerciseId) return;

//     if (exerciseId === "preview") {
//       fetchPreview().then(setExercise).catch(() => setState("ERROR"));
//     } else {
//       exerciseService.fetchById(exerciseId)
//         .then(setExercise)
//         .catch(() => setState("ERROR"));
//     }
//   }, [exerciseId, exerciseService]);

//   return { exercise, state, setState };
// }

import { type User as FirebaseUser } from "firebase/auth";
import { useEffect, useState } from "react";
import { exerciseService } from "../services/exerciseService";
import { type Exercise } from "../types/Exercise";
import { type User } from "../types/User";
import { useAuth } from "./useAuth";

interface AppData {
  isReady: boolean;
  authUser: FirebaseUser | null;
  user: User | null;
  exercises: Exercise[] | null;
}

export function useAppData(): AppData {
  const { authUser, authLoadComplete, user } = useAuth();
  const [exercises, setExercises] = useState<Exercise[] | null>(null);

  // Fetch exercises when authenticated and user is ready
  useEffect(() => {
    if (!authUser) {
      return;
    }

    const fetchExercises = async () => {
      const exercises = await exerciseService.fetchByCourse("SDEV 120");
      setExercises(exercises);
    };

    fetchExercises();
  }, [authUser]);

  // Determine if app is ready to render
  const isReady =
    authLoadComplete && (!authUser || (user !== null && exercises !== null));

  return {
    isReady,
    authUser,
    user,
    exercises,
  };
}

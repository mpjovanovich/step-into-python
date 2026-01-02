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

  // Fetch exercises once when user document is first available
  useEffect(() => {
    if (!user) {
      setExercises(null);
      return;
    }

    const fetchExercises = async () => {
      const exercises = await exerciseService.fetchAll();
      setExercises(exercises);
    };

    fetchExercises();
  }, [user?.id]);

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

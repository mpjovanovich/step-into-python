import { auth } from "@/firebase";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { useEffect, useState } from "react";

export interface AuthContextType {
  authReady: boolean;
  authUser: FirebaseUser | null;
}

export function useAuth(): AuthContextType {
  const [authReady, setAuthReady] = useState(false);
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    auth.authStateReady().then(() => {
      setAuthUser(auth.currentUser);
      setAuthReady(true);
    });

    // This will detect changes, like logout.
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setAuthUser(firebaseUser);
    });

    return () => unsubscribeAuth();
  }, []);

  return {
    authReady,
    authUser,
  };
}

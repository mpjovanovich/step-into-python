import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { userService } from "../services/userService";
import { type User } from "../types/User";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let unsubscribeUser: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (unsubscribeUser) {
        unsubscribeUser();
        unsubscribeUser = undefined;
      }

      setAuthUser(firebaseUser);

      if (firebaseUser) {
        unsubscribeUser = userService.subscribeToUser(
          firebaseUser.uid,
          (userData: User | null) => {
            if (!userData) {
              console.error("No matching user found in the database");
            }
            setUser(userData);
            setIsReady(true);
          }
        );
      } else {
        setUser(null);
        setIsReady(true);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeUser?.();
    };
  }, []);

  if (!isReady) {
    return fallback;
  }

  return (
    <AuthContext.Provider value={{ authUser, user }}>
      {children}
    </AuthContext.Provider>
  );
};

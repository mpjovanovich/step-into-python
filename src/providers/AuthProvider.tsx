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
        const fetchUser = async () => {
          const user = await userService.fetchById(firebaseUser.uid);
          if (user) {
            setUser(user);
          } else {
            setUser(null);
          }
          setIsReady(true);
        };
        fetchUser();
      } else {
        setUser(null);
        setIsReady(true);
      }
    });

    return () => {
      unsubscribeAuth();
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

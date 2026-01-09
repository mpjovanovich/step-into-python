import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { auth } from "../firebase";
import { userService } from "../services/userService";
import { type User } from "../types/User";

export interface AuthContextType {
  authUser: FirebaseUser | null;
  authLoading: boolean;
  user: User | null;
  error: Error | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Listen for auth state changes.
  useEffect(() => {
    try {
      let unsubscribeUser: (() => void) | undefined;

      const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
        // Clean up previous user subscription if present
        if (unsubscribeUser) {
          unsubscribeUser();
          unsubscribeUser = undefined;
        }

        setAuthUser(firebaseUser);
        setAuthLoading(false);

        if (firebaseUser && firebaseUser.email) {
          // Set up real-time listener for user data using userService
          unsubscribeUser = userService.subscribeToUser(
            firebaseUser.uid,
            (userData: User | null) => {
              if (!userData) {
                console.error("No matching user found in the database");
              }
              setUser(userData);
            }
          );
        } else {
          // Clear user state when logged out
          setUser(null);
        }
      });

      // Clean up both listeners when component unmounts
      return () => {
        unsubscribeAuth();
        if (unsubscribeUser) {
          unsubscribeUser();
        }
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch user"));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, authLoading, user, error }}>
      {children}
    </AuthContext.Provider>
  );
};

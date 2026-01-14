import { type User as FirebaseUser } from "firebase/auth";
import { createContext } from "react";
import { type User } from "../types/User";

export interface AuthContextType {
  authUser: FirebaseUser | null;
  user: User | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

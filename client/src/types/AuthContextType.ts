import { type User as FirebaseUser } from "firebase/auth";

export interface AuthContextType {
  authReady: boolean;
  authUser: FirebaseUser | null;
}

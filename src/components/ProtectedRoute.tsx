import { type User as FirebaseUser } from "firebase/auth";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  authUser: FirebaseUser | null;
  children: React.ReactNode;
}

export function ProtectedRoute({ authUser, children }: ProtectedRouteProps) {
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

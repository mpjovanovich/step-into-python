import { type User as FirebaseUser } from "firebase/auth";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  authUser: FirebaseUser | null;
  children: React.ReactNode;
}

export function PublicRoute({ authUser, children }: PublicRouteProps) {
  if (authUser) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

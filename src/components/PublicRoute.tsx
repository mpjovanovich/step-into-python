import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { authUser } = useAuthContext();

  if (authUser) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default PublicRoute;

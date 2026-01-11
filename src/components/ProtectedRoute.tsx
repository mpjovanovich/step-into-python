// import { Navigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import Loading from "./Loading";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
//   const { authUser, user } = useAuth();

//   if (!authUser) {
//     return <Navigate to="/login" replace />;
//   }

//   // We will assume that any protected route is going to need the user object.
//   // There is a delay between the authUser being set and the user being set, so
//   // we need to prevent the page from rendering until the user is set.

//   if (!user) {
//     return <Loading />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;

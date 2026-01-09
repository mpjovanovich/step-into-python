import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ExercisePage from "../pages/Exercise/ExercisePage";
import ExercisesPage from "../pages/Exercises/ExercisesPage";
import LoginPage from "../pages/Login/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const Router = ({
  children,
}: {
  children?: React.ReactNode; //
}) => {
  return (
    <BrowserRouter>
      {children}
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/exercises"
          element={
            <ProtectedRoute>
              <ExercisesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercise/:exerciseId"
          element={
            <ProtectedRoute>
              <ExercisePage />
            </ProtectedRoute>
          }
        />

        {/* Convenience redirect for the root path */}
        <Route path="*" element={<Navigate to="/exercises" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

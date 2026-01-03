import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { useAuth } from "./hooks/useAuth";
import ExercisePage from "./pages/Exercise/ExercisePage";
import ExercisesPage from "./pages/Exercises/ExercisesPage";
import LoginPage from "./pages/Login/LoginPage";
import "./styles/global.css";

export default function App() {
  const { authUser, authLoading, user, error } = useAuth();

  // TODO: better error handling
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <Header isAuthenticated={!!authUser} />
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              <PublicRoute authUser={authUser}>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/exercises"
            element={
              <ProtectedRoute authUser={authUser}>
                {/* TODO: get rid of user prop */}
                {user && <ExercisesPage user={user} />}
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercise/:exerciseId"
            element={
              <ProtectedRoute authUser={authUser}>
                {/* TODO: get rid of user prop */}
                {user && <ExercisePage user={user} />}
              </ProtectedRoute>
            }
          />

          {/* Convenience redirect for the root path */}
          <Route path="*" element={<Navigate to="/exercises" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

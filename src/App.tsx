import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { AuthProvider, useAuthContext } from "./contexts/AuthContext";
import ExercisePage from "./pages/Exercise/ExercisePage";
import ExercisesPage from "./pages/Exercises/ExercisesPage";
import LoginPage from "./pages/Login/LoginPage";
import "./styles/global.css";

const AppContent = () => {
  // Must be inside AuthProvider, which is why we have this sub-component
  const { authLoading, error } = useAuthContext();

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
        <Header />
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
      </div>
    </BrowserRouter>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

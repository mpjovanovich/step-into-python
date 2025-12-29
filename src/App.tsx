import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import { useAuth } from "./hooks/useAuth";
import ExercisePage from "./pages/Exercise/ExercisePage";
import ExercisesPage from "./pages/Exercises/ExercisesPage";
import LoginPage from "./pages/Login/LoginPage";
import { exerciseService } from "./services/exerciseService";
import "./styles/global.css";
import { type Exercise as ExerciseType } from "./types/Exercise";

export default function App() {
  const { authUser, isAuthLoading, user } = useAuth();
  const [exercises, setExercises] = useState<ExerciseType[]>([]);

  // Fetch the exercises from Firestore.
  useEffect(() => {
    // Don't fetch if not finished authenticating.
    if (!authUser) {
      return;
    }

    const fetchExercises = async () => {
      const exercises = await exerciseService.fetchByCourse("SDEV 120");
      setExercises(exercises);
    };

    fetchExercises();
  }, [authUser, exerciseService]);

  // Don't render routes until we know auth status
  if (isAuthLoading) {
    return null;
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <Header isAuthenticated={!!authUser} />
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          {authUser ? (
            <>
              <Route
                path="/"
                element={<ExercisesPage user={user} exercises={exercises} />}
              />
              <Route
                path="/exercise/:exerciseId"
                element={<ExercisePage user={user} />}
              />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

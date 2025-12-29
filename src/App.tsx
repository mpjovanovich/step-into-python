import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import { useAppData } from "./hooks/useAppData";
import ExercisePage from "./pages/Exercise/ExercisePage";
import ExercisesPage from "./pages/Exercises/ExercisesPage";
import LoginPage from "./pages/Login/LoginPage";
import "./styles/global.css";

export default function App() {
  const { isReady, authUser, user, exercises } = useAppData();

  if (!isReady) {
    return null;
  }

  const isAuthenticated = !!authUser;

  return (
    <BrowserRouter>
      <div className="app-container">
        <Header isAuthenticated={isAuthenticated} />
        <Routes>
          {isAuthenticated ? (
            <>
              {/* PROTECTED ROUTES */}
              {/* Exercises page is root route */}
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route
                path="/"
                element={<ExercisesPage user={user!} exercises={exercises!} />}
              />
              {/* Exercise page */}
              <Route
                path="/exercise/:exerciseId"
                element={<ExercisePage user={user!} />}
              />
            </>
          ) : (
            <>
              {/* PUBLIC ROUTES */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

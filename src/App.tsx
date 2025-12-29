import type { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { auth } from "./firebase";

import ExercisePage from "./pages/Exercise/ExercisePage";
import LoginPage from "./pages/Login/LoginPage";
import { createExerciseService } from "./services/exerciseService";
import { createUserService } from "./services/userService";
import "./styles/global.css";
import { type Exercise as ExerciseType } from "./types/Exercise";
import { type User } from "./types/User";
import { formatExerciseNumber } from "./utils/formatters";

export default function App() {
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [exercises, setExercises] = useState<ExerciseType[]>([]);

  const db = useMemo(() => getFirestore(), []);
  const userService = useMemo(() => createUserService(db), [db]);
  const exerciseService = useMemo(() => createExerciseService(db), [db]);

  // Listen for auth state changes.
  useEffect(() => {
    let unsubscribeUser: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setAuthUser(firebaseUser);
      setIsAuthLoading(false);

      if (firebaseUser && firebaseUser.email) {
        // Set up real-time listener for user data using userService
        unsubscribeUser = userService.subscribeToUser(
          firebaseUser.email,
          (userData: User | null) => {
            if (!userData) {
              // TODO: not sure if this is handled appropriately?
              console.error("No matching user found in the database");
            }
            setUser(userData);
          }
        );
      } else {
        // Clean up user listener and clear user state when logged out
        if (unsubscribeUser) {
          unsubscribeUser();
          unsubscribeUser = undefined;
        }
        setUser(null);
      }
    });

    // Clean up both listeners when component unmounts
    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) {
        unsubscribeUser();
      }
    };
  }, [userService]);

  // Fetch the exercises from Firestore.
  useEffect(() => {
    // Don't fetch if not authenticated
    if (!authUser) return;

    const fetchExercises = async () => {
      const exercises = await exerciseService.fetchByCourse("SDEV 120");
      setExercises(exercises);
    };

    fetchExercises();
  }, [authUser, exerciseService]);

  const getHomePage = () => {
    return (
      <div style={{ padding: "0 2rem" }}>
        <h1 className="title">Exercises: {user?.name}</h1>
        <ul className="exercises-list">
          {exercises.map((exercise) => (
            <li key={exercise.id}>
              <span className="inline-flex-wrapper">
                <span className="completed-exercise">
                  {user?.completedExercises.includes(exercise.id) ? (
                    <MdCheckCircle className="icon-complete" />
                  ) : (
                    <MdRadioButtonUnchecked className="icon-incomplete" />
                  )}
                </span>
                <Link to={`/exercise/${exercise.id}`}>
                  {formatExerciseNumber(exercise.order)}
                  {": "}
                  {exercise.title}
                </Link>
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

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
              <Route path="/" element={getHomePage()} />
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

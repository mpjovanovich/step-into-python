import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import Exercise from "./pages/Exercise/Exercise";
import Login from "./pages/Login/Login";
import Header from "./components/Header";
import type { User } from "./types/User";
import type { Exercise as ExerciseType } from "./types/Exercise";
import "./styles/global.css";
import { auth } from "./firebase";
export default function App() {
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [exercises, setExercises] = useState<ExerciseType[]>([]);

  // Listen for auth state changes.
  useEffect(() => {
    // It's a React best practice to return the cleanup function; React will
    // call it when the component unmounts.
    return onAuthStateChanged(auth, (firebaseUser) => {
      setAuthUser(firebaseUser);
    });
  }, []);

  // Fetch the exercises from Firestore.
  useEffect(() => {
    // We can't use async directly in useEffect, so we need to define a function
    // inside.  It's a limitation of React.
    const fetchExercises = async () => {
      const db = getFirestore();
      const q = query(
        collection(db, "exercises"),
        where("course", "==", "SDEV 120")
      );
      const querySnapshot = await getDocs(q);
      setExercises(
        // We have to add the id to the exercise object because it's not
        // included in the Firestore document.
        querySnapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as ExerciseType)
        )
      );
    };

    fetchExercises();
  }, []);

  const getHomePage = (): JSX.Element => {
    return (
      <div className="home-page" style={{ padding: "0 2rem" }}>
        <h1 className="title">Home Page</h1>
        <ul>
          {exercises.map((exercise) => (
            <li key={exercise.id}>
              <Link to={`/exercise/${exercise.id}`}>
                Exercise: {exercise.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Header isAuthenticated={!!authUser} />
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          {authUser ? (
            <>
              <Route path="/" element={getHomePage()} />
              <Route path="/exercise/:exerciseId" element={<Exercise />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
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
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [exercises, setExercises] = useState<ExerciseType[]>([]);

  // Listen for auth state changes.
  useEffect(() => {
    // It's a React best practice to return the cleanup function; React will
    // call it when the component unmounts.
    return onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthUser(firebaseUser);
      setIsAuthLoading(false);

      if (firebaseUser) {
        // Fetch the domain user when Firebase auth succeeds
        const db = getFirestore();
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", firebaseUser.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setUser({ ...userDoc.data(), id: userDoc.id } as User);
        } else {
          // TODO: better error handling
          console.error("No matching user found in the database");
          setUser(null);
        }
      } else {
        // Clear the domain user when logged out
        setUser(null);
      }
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
      <div style={{ padding: "0 2rem" }}>
        <h1 className="title">My Exercises</h1>
        <ul className="exercises-list">
          {exercises.map((exercise) => (
            <li key={exercise.id}>
              {/* TODO: styles, e.g. margin-right */}
              <span className="completed-exercise">
                {user?.completedExercises.includes(exercise.id) ? (
                  <MdCheckBox className="icon-complete" />
                ) : (
                  <MdCheckBoxOutlineBlank className="icon-incomplete" />
                )}
              </span>
              <Link to={`/exercise/${exercise.id}`}>
                Exercise: {exercise.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Don't render routes until we know auth status
  if (isAuthLoading) {
    return null; // or a loading spinner
  }

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

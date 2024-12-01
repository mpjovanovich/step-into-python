import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
// import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
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
    let unsubscribeUser: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setAuthUser(firebaseUser);
      setIsAuthLoading(false);

      if (firebaseUser) {
        // Set up real-time listener for user data
        const db = getFirestore();
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", firebaseUser.email));

        unsubscribeUser = onSnapshot(q, (querySnapshot) => {
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            setUser({ ...userDoc.data(), id: userDoc.id } as User);
          } else {
            console.error("No matching user found in the database");
            setUser(null);
          }
        });
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
      if (unsubscribeUser) unsubscribeUser();
    };
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
              <span className="inline-flex-wrapper">
                <span className="completed-exercise">
                  {user?.completedExercises.includes(exercise.id) ? (
                    // <MdCheckBox className="icon-complete" />
                    <MdCheckCircle className="icon-complete" />
                  ) : (
                    // <MdCheckBoxOutlineBlank className="icon-incomplete" />
                    <MdRadioButtonUnchecked className="icon-incomplete" />
                  )}
                </span>
                <Link to={`/exercise/${exercise.id}`}>
                  Exercise: {exercise.title}
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
              <Route
                path="/exercise/:exerciseId"
                element={<Exercise user={user} />}
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

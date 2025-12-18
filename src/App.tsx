import type { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { auth } from "./firebase";
import Exercise from "./pages/Exercise/Exercise";
import Login from "./pages/Login/Login";
import "./styles/global.css";
import type { Exercise as ExerciseType } from "./types/Exercise";
import type { User } from "./types/User";
import { formatExerciseNumber } from "./utils/formatters";

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
    // Don't fetch if not authenticated
    if (!authUser) return;

    const fetchExercises = async () => {
      const db = getFirestore();
      const q = query(
        collection(db, "exercises"),
        where("course", "==", "SDEV 120"),
        orderBy("order")
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
  }, [authUser]);

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

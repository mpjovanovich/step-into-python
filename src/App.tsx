import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import Exercise from "./pages/Exercise/Exercise";
import Login from "./pages/Login/Login";
import type { Exercise as ExerciseType } from "./types/Exercise";
import "./styles/global.css";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<ExerciseType[]>([]);

  // useEffect(() => {
  //   const auth = getAuth();
  //   return onAuthStateChanged(auth, (user) => {
  //     setUser(user);
  //     setLoading(false);
  //   });
  // }, []);
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

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
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={getHomePage()} />
          <Route path="/exercise/:exerciseId" element={<Exercise />} />
        </Routes>
      </div>
    </BrowserRouter>
  );

  // return (
  //   <BrowserRouter>
  //     <div className="app-container">
  //       <Routes>
  //         {/* Public route */}
  //         <Route path="/login" element={<Login />} />

  //         {/* Protected routes */}
  //         {user ? (
  //           <>
  //             <Route path="/" element={getHomePage()} />
  //             <Route path="/exercise/:exerciseId" element={<Exercise />} />
  //           </>
  //         ) : (
  //           <Route path="*" element={<Navigate to="/login" replace />} />
  //         )}
  //       </Routes>
  //     </div>
  //   </BrowserRouter>
  // );
}

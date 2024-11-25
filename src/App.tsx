import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Exercise from "./pages/Exercise/Exercise";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import "./styles/global.css";
import { useState, useEffect } from "react";

export default function App() {
  const [exercises, setExercises] = useState<any[]>([]);

  useEffect(() => {
    // We can't use async directly in useEffect, so we need to define a function inside.
    // It's a limitation of React.
    const fetchExercises = async () => {
      const db = getFirestore();
      const q = query(
        collection(db, "exercises"),
        where("course", "==", "SDEV 120")
      );
      const querySnapshot = await getDocs(q);
      setExercises(querySnapshot.docs.map((doc) => doc.data()));
    };

    fetchExercises();
  }, []);

  console.log(exercises);

  // TODO: This page will link to all of the exercises for a user by course / section
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
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
            }
          />
          <Route path="/exercise/:exerciseId" element={<Exercise />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

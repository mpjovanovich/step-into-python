import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Exercise from "./pages/Exercise/Exercise";
import "./styles/global.css";

export default function App() {
  // TODO: This page will link to all of the exercises for a user by course / section
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              <div className="home-page">
                <h1 className="title">Home Page</h1>
                <Link to={`/exercise/fnIN98zNyOamSububVC1`}>
                  Exercise: fnIN98zNyOamSububVC1
                </Link>
              </div>
            }
          />
          <Route path="/exercise/:exerciseId" element={<Exercise />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

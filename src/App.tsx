import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Exercise from "./pages/Exercise/Exercise";
import "./styles/global.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              <div className="home-page">
                <h1 className="title">Home Page</h1>
                <Link to="/exercise" className="nav-link">
                  Exercise
                </Link>
              </div>
            }
          />
          <Route path="/exercise" element={<Exercise />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

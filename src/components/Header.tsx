import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { createExerciseCache } from "../cache/exerciseCache";
import { useAuthContext } from "../contexts/AuthContext";
import { auth } from "../firebase";
import { exerciseService } from "../services/exerciseService";

const Header = () => {
  const { authUser } = useAuthContext();
  const isAuthenticated = !!authUser;
  const exerciseCache = createExerciseCache(exerciseService, localStorage);

  return (
    <header className="header">
      {
        <nav>
          <Link className="app-title" to="/">
            Step Into Python
          </Link>
          {isAuthenticated && (
            <button
              className="logout-button"
              onClick={() => {
                signOut(auth);
                exerciseCache.clear();
              }}
            >
              Logout
            </button>
          )}
        </nav>
      }
    </header>
  );
};

export default Header;

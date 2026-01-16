import { getExerciseCache } from "@/cache/exerciseCache";
import { auth } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "@tanstack/react-router";
import { signOut } from "firebase/auth";

const Header = () => {
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const isAuthenticated = !!authUser;

  return (
    <header className="header">
      <nav>
        <Link className="app-title" to="/exercises">
          Step Into Python
        </Link>
        {isAuthenticated && (
          <button
            className="logout-button"
            onClick={async () => {
              getExerciseCache().clear();
              await signOut(auth);
              navigate({ to: "/login" });
            }}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;

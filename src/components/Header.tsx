import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { auth } from "../firebase";

const Header = () => {
  const { authUser } = useAuthContext();
  const isAuthenticated = !!authUser;

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
                // Clear the cache
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

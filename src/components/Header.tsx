import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

interface HeaderProps {
  isAuthenticated: boolean;
}

const Header = ({ isAuthenticated }: HeaderProps) => {
  return (
    <header className="header">
      {
        <nav>
          {/* TODO: This is really sparse... need a more subtle way to allow logout */}
          <Link className="app-title" to="/">
            Step Into Python
          </Link>
          {isAuthenticated && (
            <button className="logout-button" onClick={() => signOut(auth)}>
              Logout
            </button>
          )}
        </nav>
      }
    </header>
  );
};

export default Header;

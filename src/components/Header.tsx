import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

interface HeaderProps {
  isAuthenticated: boolean;
}

const Header = ({ isAuthenticated }: HeaderProps) => {
  return (
    <header className="header">
      {isAuthenticated && (
        <nav>
          {/* TODO: This is really sparse... need a more subtle way to allow logout */}
          <Link to="/">Home</Link>
          <button onClick={() => signOut(auth)}>Logout</button>
        </nav>
      )}
    </header>
  );
};

export default Header;

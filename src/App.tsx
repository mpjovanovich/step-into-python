import EmulatorWarning from "./components/EmulatorWarning";
import Header from "./components/Header";
import Router from "./components/Router";
import { AuthProvider } from "./providers/AuthProvider";
import "./styles/global.css";

const App = () => {
  return (
    <>
      <EmulatorWarning />
      <AuthProvider>
        <Router>
          <Header />
        </Router>
      </AuthProvider>
    </>
  );
};

export default App;

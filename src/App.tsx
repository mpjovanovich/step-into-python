import EmulatorWarning from "./components/EmulatorWarning";
import Router from "./components/Router";
import { AuthProvider } from "./providers/AuthProvider";
import "./styles/global.css";

const App = () => {
  return (
    <>
      <EmulatorWarning />
      <AuthProvider>
        <Router />
      </AuthProvider>
    </>
  );
};

export default App;

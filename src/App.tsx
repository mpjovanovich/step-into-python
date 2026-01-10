import EmulatorWarning from "./components/EmulatorWarning";
import Header from "./components/Header";
import Router from "./components/Router";
import { AuthProvider } from "./providers/AuthProvider";
import { ExerciseCacheProvider } from "./providers/ExerciseCacheProvider";
import "./styles/global.css";

const App = () => {
  return (
    <>
      <EmulatorWarning />
      <AuthProvider>
        <ExerciseCacheProvider>
          <Router>
            <Header />
          </Router>
        </ExerciseCacheProvider>
      </AuthProvider>
    </>
  );
};

export default App;

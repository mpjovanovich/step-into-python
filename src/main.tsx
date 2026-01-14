import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import EmulatorWarning from "./components/EmulatorWarning";
import Loading from "./components/Loading";
import { AuthProvider } from "./providers/AuthProvider";
import { ExerciseCacheProvider } from "./providers/ExerciseCacheProvider";
import "./styles/global.css";

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <EmulatorWarning />
      <AuthProvider fallback={<Loading />}>
        <ExerciseCacheProvider>
          <App />
        </ExerciseCacheProvider>
      </AuthProvider>
    </StrictMode>
  );
}

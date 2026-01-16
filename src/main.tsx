import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import EmulatorWarning from "./components/EmulatorWarning";
import { ExerciseCacheProvider } from "./providers/ExerciseCacheProvider";
import "./styles/global.css";

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <EmulatorWarning />
      <ExerciseCacheProvider>
        <App />
      </ExerciseCacheProvider>
    </StrictMode>
  );
}

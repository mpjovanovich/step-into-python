import App from "@/App";
import EmulatorWarning from "@/components/EmulatorWarning";
import "@/styles/global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./components/AuthContext";

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <Toaster />
      <EmulatorWarning />
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>
  );
}

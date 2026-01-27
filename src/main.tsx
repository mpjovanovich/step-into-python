import App from "@/App";
import ErrorFallback from "@/components/ErrorFallback";
import "@/styles/global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./components/AuthContext";

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <Toaster />
      <AuthProvider>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
        <App />
        </ErrorBoundary>
      </AuthProvider>
    </StrictMode>
  );
}

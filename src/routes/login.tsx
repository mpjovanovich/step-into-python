import { auth } from "@/firebase";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  beforeLoad: async ({ context }) => {
    if (context.auth.authUser?.uid) {
      throw redirect({ to: "/exercises" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // TODO: Refactor this whole component. It's messy.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate({ to: "/exercises" });
    } catch (err: unknown) {
      // Handle specific Firebase auth errors
      let errorMessage = "Failed to sign in. Please try again.";

      if (
        err instanceof FirebaseError &&
        err.code === "auth/too-many-requests"
      ) {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        (err.code === "auth/user-not-found" ||
          err.code === "auth/wrong-password" ||
          err.code === "auth/invalid-email")
      ) {
        errorMessage = "Invalid email or password.";
      } else {
        throw err;
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  // TODO: extract styles to a CSS file.
  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1.5rem", color: "white" }}>Sign In</h1>

      <form onSubmit={handleSubmit} autoComplete="on">
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              color: "white",
              marginBottom: "0.5rem",
            }}
          >
            Email
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
                marginTop: "0.5rem",
                fontSize: "1rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="password"
            style={{
              display: "block",
              color: "white",
              marginBottom: "0.5rem",
            }}
          >
            Password
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
                marginTop: "0.5rem",
                fontSize: "1rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
            />
          </label>
        </div>

        {error && (
          <div
            style={{
              padding: "0.75rem",
              marginBottom: "1rem",
              backgroundColor: "#fee",
              color: "#c33",
              borderRadius: "4px",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem",
            fontSize: "1rem",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

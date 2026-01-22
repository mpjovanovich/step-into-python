import { auth } from "@/firebase";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/login/")({
  beforeLoad: async ({ context }) => {
    if (context.auth.authUser?.uid) {
      throw redirect({ to: "/exercises" });
    }
  },
  component: LoginPage,
});

type LoginFormData = {
  email: string;
  password: string;
};

function LoginPage() {
  const navigate = useNavigate();

  // TODO: Extract this to a custom hook.
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function getFirebaseAuthErrorMessage(error: FirebaseError): string {
    // TODO: Log errors to error reporting service.
    switch (error.code) {
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-email":
      case "auth/invalid-credential":
        return "Invalid email or password.";
      default:
        return "Unknown error occurred. Please contact support.";
    }
  }

  // TODO: Refactor this whole component. It's messy.
  const onSubmit = async (data: LoginFormData) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate({ to: "/exercises" });
    } catch (err: unknown) {
      if (!(err instanceof FirebaseError)) {
        throw err;
      }

      const errorMessage = getFirebaseAuthErrorMessage(err);
      setError("root", { type: "manual", message: errorMessage });
    }
  };

  // TODO: extract styles to a CSS file.
  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1.5rem", color: "white" }}>Sign In</h1>

      <form onSubmit={handleSubmit(onSubmit)} autoComplete="on">
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
              autoComplete="email"
              {...register("email", {
                required: "Email is required",
              })}
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "0.75rem",
                marginTop: "0.5rem",
                fontSize: "1rem",
                border: errors.email ? "1px solid #c33" : "1px solid #ccc",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
            />
          </label>
          {errors.email && (
            <div
              style={{
                color: "#c33",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
              }}
            >
              {errors.email.message}
            </div>
          )}
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
              autoComplete="current-password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 12,
                  message: "Password must be at least 12 characters",
                },
              })}
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "0.75rem",
                marginTop: "0.5rem",
                fontSize: "1rem",
                border: errors.password ? "1px solid #c33" : "1px solid #ccc",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
            />
          </label>
          {errors.password && (
            <div
              style={{
                color: "#c33",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
              }}
            >
              {errors.password.message}
            </div>
          )}
        </div>

        {errors.root && (
          <div
            style={{
              padding: "0.75rem",
              marginBottom: "1rem",
              backgroundColor: "#fee",
              color: "#c33",
              borderRadius: "4px",
            }}
          >
            {errors.root.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: "0.75rem",
            fontSize: "1rem",
            backgroundColor: isSubmitting ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

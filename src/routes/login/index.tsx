import FormButton from "@/components/FormButton";
import FormError from "@/components/FormError";
import FormField from "@/components/FormField";
import FormLabel from "@/components/FormLabel";
import FormText from "@/components/FormText";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useLogin } from "./hooks/-useLogin";

export const Route = createFileRoute("/login/")({
  beforeLoad: async ({ context }) => {
    if (context.auth.authUser?.uid) {
      throw redirect({ to: "/exercises" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, errors, isSubmitting } = useLogin({
    onSuccess: () => {
      navigate({ to: "/exercises" });
      // This is just here to block until the navigation is complete.
      // It will never resolve.
      return new Promise(() => {});
    },
  });

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1.5rem", color: "white" }}>Sign In</h1>

      <form onSubmit={handleSubmit} autoComplete="on">
        <FormField>
          <FormLabel htmlFor="email">
            Email
            <FormText
              id="email"
              type="email"
              autoComplete="email"
              {...register("email", {
                required: "Email is required",
              })}
              disabled={isSubmitting}
            />
          </FormLabel>
          {errors.email && <FormError>{errors.email.message}</FormError>}
        </FormField>

        <FormField>
          <FormLabel htmlFor="password">
            Password
            <FormText
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
            />
          </FormLabel>
          {errors.password && <FormError>{errors.password.message}</FormError>}
        </FormField>

        {errors.root && <FormError>{errors.root.message}</FormError>}

        <FormButton
          isDisabled={isSubmitting}
          type="submit"
          style={{ width: "100%" }}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </FormButton>
      </form>
    </div>
  );
}

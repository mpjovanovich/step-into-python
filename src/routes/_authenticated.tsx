import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import Loading from "../components/Loading";
import { useAuth } from "../hooks/useAuth";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    await context.auth.authStateReady();
    if (!context.auth.authUser) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => {
    // Even though we have the firebase auth user, we may not have the
    // application user yet, so we can't allow any dependent routes to render.
    const { user } = useAuth();
    if (!user) {
      return <Loading />;
    }
    return <Outlet />;
  },
});

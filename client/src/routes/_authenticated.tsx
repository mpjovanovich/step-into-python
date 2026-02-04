import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    if (!context.auth.authUser?.uid) {
      throw redirect({ to: "/login/" });
    }
  },
  component: () => {
    return <Outlet />;
  },
});

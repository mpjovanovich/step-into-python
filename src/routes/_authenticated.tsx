import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { userService } from "../services/userService";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    if (!context.auth.authUser?.uid) {
      throw redirect({ to: "/login" });
    }

    const user = await userService.getUser(context.auth.authUser?.uid);
    if (!user) {
      // TODO: Handle error; this should never happen.
      throw redirect({ to: "/login" });
    }

    return { user };
  },
  pendingMs: 0,
  component: () => {
    return <Outlet />;
  },
});

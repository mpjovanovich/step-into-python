import Header from "@/components/Header";
import { type AuthContextType } from "@/hooks/useAuth";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

interface RouterContext {
  auth: AuthContextType;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootPage,
});

function RootPage() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}

import Loading from "@/components/Loading";
import { useAuth } from "@/hooks/useAuth";
import { routeTree } from "@/routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";

const router = createRouter({
  routeTree,
  context: { auth: undefined! },
  defaultPendingComponent: () => <Loading />,
});

const App = () => {
  const auth = useAuth();

  if (!auth.authReady) {
    return <Loading />;
  }

  return <RouterProvider router={router} context={{ auth }} />;
};

export default App;

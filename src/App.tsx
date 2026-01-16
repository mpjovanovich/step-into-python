import Loading from "@/components/Loading";
import NotFound from "@/components/NotFound";
import { useAuthContext } from "@/hooks/useAuthContext";
import { routeTree } from "@/routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";

const router = createRouter({
  routeTree,
  context: { auth: undefined! },
  defaultPendingComponent: () => <Loading />,
  defaultNotFoundComponent: () => <NotFound />,
});

const App = () => {
  const authContext = useAuthContext();

  if (!authContext.authReady) {
    return <Loading />;
  }

  return <RouterProvider router={router} context={{ auth: authContext }} />;
};

export default App;

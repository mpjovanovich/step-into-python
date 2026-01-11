import { createRouter, RouterProvider } from "@tanstack/react-router";
import Loading from "./components/Loading";
import { useAuth } from "./hooks/useAuth";
import { routeTree } from "./routeTree.gen";

const App = () => {
  const auth = useAuth();
  const router = createRouter({
    routeTree,
    context: { auth },
    defaultPendingComponent: () => <Loading />,
  });

  return <RouterProvider router={router} />;
};

export default App;

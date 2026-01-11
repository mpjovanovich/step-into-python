import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/exercises/$exerciseId")({
  component: RouteComponent,
});

function RouteComponent() {
  // const { exerciseId } = useParams();
  // console.log(exerciseId);
  return <div>Hello "/_authenticated/exercise/"!</div>;
}

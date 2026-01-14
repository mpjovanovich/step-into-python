import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/exercises/$exerciseId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { exerciseId } = Route.useParams();
  return <div>Exercise {exerciseId}</div>;
}

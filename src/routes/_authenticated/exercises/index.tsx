import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/exercises/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Exercises</div>;
}

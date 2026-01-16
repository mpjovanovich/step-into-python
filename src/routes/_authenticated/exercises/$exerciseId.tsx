import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/exercises/$exerciseId")({
  component: ExercisePage,
});

function ExercisePage() {
  const { exerciseId } = Route.useParams();
  return <div>Exercise {exerciseId}</div>;
}

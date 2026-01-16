import { createFileRoute, Link, useRouteContext } from "@tanstack/react-router";
import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";
import Loading from "../../../components/Loading";
import { formatExerciseNumber } from "../../../utils/formatters";
import { useExercises } from "./hooks/useExercises";

export const Route = createFileRoute("/_authenticated/exercises/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useRouteContext({
    from: "/_authenticated",
  });

  const { exercises } = useExercises(user.id);
  if (!exercises) {
    return <Loading />;
  }

  return (
    <div style={{ padding: "0 2rem" }}>
      <h1 className="title">Exercises: {user.name}</h1>
      <ul className="exercises-list">
        {exercises!.map((exercise) => (
          <li key={exercise.id}>
            <span className="inline-flex-wrapper">
              <span className="completed-exercise">
                {user.completedExercises.includes(exercise.id) ? (
                  <MdCheckCircle className="icon-complete" />
                ) : (
                  <MdRadioButtonUnchecked className="icon-incomplete" />
                )}
              </span>
              <Link to={"/exercise"}>
                {formatExerciseNumber(exercise.order)}
                {": "}
                {exercise.title}
              </Link>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

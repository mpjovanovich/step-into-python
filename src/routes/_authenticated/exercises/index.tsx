import { exerciseService } from "@/services/exerciseService";
import { userService } from "@/services/userService";
import { type Exercise } from "@/types/Exercise";
import { formatExerciseNumber } from "@/utils/formatters";
import {
  createFileRoute,
  Link,
  useLoaderData
} from "@tanstack/react-router";
import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";

export const Route = createFileRoute("/_authenticated/exercises/")({
  loader: async ({ context }) => {
    // Get user
    const user = await userService.getUser(context.auth.authUser!.uid);
    if (user.error) {
      // Let the error boundary handle the error.
      throw new Error(user.error);
    }

    // Get exercises
    const exercises = await exerciseService.fetchAll();
    if (exercises.error) {
      // Let the error boundary handle the error.
      throw new Error(exercises.error);
    }

    return { exercises: exercises.data, user: user.data };
  },
  component: ExercisesPage,
});

function ExercisesPage() {
  const { exercises, user } = useLoaderData({
    from: "/_authenticated/exercises/",
  });

  return (
    <div style={{ padding: "0 2rem" }}>
      <h1 className="title">Exercises: {user.name}</h1>
      <ul className="exercises-list">
        {exercises!.map((exercise: Exercise) => (
          <li key={exercise.id}>
            <span className="inline-flex-wrapper">
              <span className="completed-exercise">
                {user.completedExercises.includes(exercise.id) ? (
                  <MdCheckCircle className="icon-complete" />
                ) : (
                  <MdRadioButtonUnchecked className="icon-incomplete" />
                )}
              </span>
              <Link to={`/exercises/${exercise.id}`}>
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

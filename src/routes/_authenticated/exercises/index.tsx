import { getExerciseCache } from "@/cache/exerciseCache";
import { userService } from "@/services/userService";
import { type Exercise } from "@/types/Exercise";
import { formatExerciseNumber } from "@/utils/formatters";
import {
  createFileRoute,
  Link,
  redirect,
  useLoaderData,
} from "@tanstack/react-router";
import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";

export const Route = createFileRoute("/_authenticated/exercises/")({
  loader: async ({ context }) => {
    // Get user
    const user = await userService.getUser(context.auth.authUser!.uid);
    if (!user) {
      // TODO: Handle error; this should never happen.
      throw redirect({ to: "/login" });
    }

    // Get exercises
    const exerciseCache = getExerciseCache();
    const exercises = await exerciseCache.fetchAll();

    return { exercises, user };
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

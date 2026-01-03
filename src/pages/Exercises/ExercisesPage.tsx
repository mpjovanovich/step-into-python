import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";
import { Link } from "react-router-dom";
import { useExercises } from "../../hooks/useExercises";
import { type User } from "../../types/User";
import { formatExerciseNumber } from "../../utils/formatters";

interface ExercisesPageProps {
  user: User;
}

export default function ExercisesPage({ user }: ExercisesPageProps) {
  const { exercises, error: exercisesError } = useExercises(user?.id ?? null);

  // TODO: better error handling
  if (exercisesError) {
    return <div>Error: {exercisesError.message}</div>;
  }

  // TODO: better loading state
  if (!exercises) {
    return <div></div>;
    // return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "0 2rem" }}>
      <h1 className="title">Exercises: {user?.name}</h1>
      <ul className="exercises-list">
        {exercises!.map((exercise) => (
          <li key={exercise.id}>
            <span className="inline-flex-wrapper">
              <span className="completed-exercise">
                {user?.completedExercises.includes(exercise.id) ? (
                  <MdCheckCircle className="icon-complete" />
                ) : (
                  <MdRadioButtonUnchecked className="icon-incomplete" />
                )}
              </span>
              <Link to={`/exercise/${exercise.id}`}>
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

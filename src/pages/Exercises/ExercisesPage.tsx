import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";
import { Link } from "react-router-dom";
import { type Exercise } from "../../types/Exercise";
import { type User } from "../../types/User";
import { formatExerciseNumber } from "../../utils/formatters";

interface ExercisesPageProps {
  user: User | null;
  exercises: Exercise[];
}

export default function ExercisesPage({ user, exercises }: ExercisesPageProps) {
  return (
    <div style={{ padding: "0 2rem" }}>
      <h1 className="title">Exercises: {user?.name}</h1>
      <ul className="exercises-list">
        {exercises.map((exercise) => (
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

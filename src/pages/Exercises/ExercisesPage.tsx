import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { useAuth } from "../../hooks/useAuth";
import { formatExerciseNumber } from "../../utils/formatters";
import { useExercises } from "./hooks/useExercises";

const ExercisesPage = () => {
  const { user } = useAuth();
  // Should never happen because of ProtectedRoute logic
  if (!user) {
    throw new Error("Cannot load page: no user");
  }

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
};

export default ExercisesPage;

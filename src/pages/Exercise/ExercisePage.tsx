// React and external libraries
import { useState } from "react";
import { useParams } from "react-router-dom";

// Internal
import Loading from "../../components/Loading";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/userService";
import styles from "./ExercisePage.module.css";
import ExerciseDescription from "./components/ExerciseDescription";
import ExerciseInstructions from "./components/ExerciseInstructions";
import NavigationButtons from "./components/NavigationButtons";
import ProgramOutput from "./components/ProgramOutput";
import { useExercise } from "./hooks/useExercise";

const ExercisePage = () => {
  const { user } = useAuth();
  // Should never happen because of ProtectedRoute logic
  if (!user) {
    throw new Error("Cannot load page: no user");
  }

  // Page state
  const [step, setStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  // Fetch exercise data
  const { exerciseId } = useParams();
  const { checkAnswerResults, currentStep, exercise } = useExercise(
    exerciseId!,
    step,
    userAnswers,
    setUserAnswers
  );

  /* ************************
   * UI
   ************************ */
  if (!exercise) {
    return <Loading />;
  }

  // Main content
  return (
    <div className={styles.exercise}>
      <h1 className={"title"}>
        {exercise ? `${exercise.title}` : "Loading Program..."}
      </h1>
      <div className={styles.container}>
        <div className={styles.instructions}>
          <ExerciseDescription
            stepType={currentStep.stepType}
            description={currentStep.descriptions}
          />
          <ExerciseInstructions
            stepType={currentStep.stepType}
            instructions={currentStep.instructions}
          />
          <NavigationButtons
            stepType={currentStep.stepType}
            canFocus={currentStep.answers.length === 0}
            onPrevious={() => setStep(step - 1)}
            onNext={() => setStep(step + 1)}
            onSubmit={() => {
              const completeExercise = async () => {
                await userService.completeExercise(user.id, exerciseId!);
                setStep(() => step + 1);
              };
              completeExercise();
            }}
          />
        </div>
        <ProgramOutput
          code={currentStep.code}
          copyCode={currentStep.copyCode}
          answers={currentStep.answers}
          userAnswers={userAnswers}
          setUserAnswers={setUserAnswers}
          checkAnswerResults={checkAnswerResults}
        />
      </div>
    </div>
  );
};

export default ExercisePage;

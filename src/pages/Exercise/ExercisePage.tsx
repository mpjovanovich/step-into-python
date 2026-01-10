// React and external libraries
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

// Internal
import Loading from "../../components/Loading";
import { checkAnswers } from "../../domain/answerChecker";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/userService";
import { type CurrentStep } from "../../types/CurrentStep";
import styles from "./ExercisePage.module.css";
import ExerciseText from "./components/ExerciseText";
import NavigationButtons from "./components/NavigationButtons";
import ProgramOutput from "./components/ProgramOutput";
import { useExercise } from "./hooks/useExercise";
import { useExerciseText } from "./hooks/useExerciseText";
import { useNavigationButtons } from "./hooks/useNavigationButtons";
import { getCurrentStepProperties } from "./utils/ExerciseUtils";

const ExercisePage = () => {
  const { user } = useAuth();
  // Should never happen because of ProtectedRoute logic
  if (!user) {
    throw new Error("Cannot load page: no user");
  }

  // Fetch exercise data
  const [step, setStep] = useState(0);
  const { exerciseId } = useParams();
  const { codeForStep, exercise, finalStep } = useExercise(exerciseId!, step);

  // Convenience variables from current exercise step and code
  const currentStep: CurrentStep = getCurrentStepProperties(
    codeForStep,
    exercise,
    step,
    finalStep
  );

  // Reset user answers when step changes
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  useEffect(() => {
    setUserAnswers(Array(currentStep.answers.length).fill(""));
  }, [step, currentStep.answers.length]);

  // Check the user's answers against the correct answers; compute as derived state
  const checkAnswerResults = useMemo(() => {
    if (userAnswers.length === 0 || currentStep.answers.length === 0) {
      return Array(currentStep.answers.length).fill(null);
    }
    return checkAnswers(userAnswers, currentStep.answers);
  }, [userAnswers, currentStep.answers]);

  // Format exercise text content based on current step
  const { formattedDescription, formattedInstructions } = useExerciseText({
    stepType: currentStep.stepType,
    description: currentStep.descriptions,
    instructions: currentStep.instructions,
  });

  const { buttons, exerciseComplete } = useNavigationButtons({
    stepType: currentStep.stepType,
    checkAnswerResults,
    onPrevious: () => setStep(step - 1),
    onNext: () => setStep(step + 1),
    onSubmit: () => {
      const completeExercise = async () => {
        await userService.completeExercise(user.id, exerciseId!);
        setStep(() => step + 1);
      };
      completeExercise();
    },
  });

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
          <ExerciseText
            description={formattedDescription}
            instructions={formattedInstructions}
          />
          <NavigationButtons
            buttons={buttons}
            canFocus={currentStep.answers.length === 0}
            exerciseComplete={exerciseComplete}
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

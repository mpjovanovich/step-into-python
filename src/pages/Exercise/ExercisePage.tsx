// React and external libraries
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

// Internal
import Loading from "../../components/Loading";
import { checkAnswers } from "../../domain/answerChecker";
import { getCodeForStep, type CodeForStep } from "../../domain/templateParser";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/userService";
import styles from "./ExercisePage.module.css";
import ExerciseText from "./components/ExerciseText";
import NavigationButtons from "./components/NavigationButtons";
import ProgramOutput from "./components/ProgramOutput";
import { useExercise } from "./hooks/useExercise";
import { useExerciseText } from "./hooks/useExerciseText";
import { useNavigationButtons } from "./hooks/useNavigationButtons";
import { getStepType } from "./utils/ExerciseUtils";

const ExercisePage = () => {
  const { user } = useAuth();
  // Should never happen because of ProtectedRoute logic
  if (!user) {
    throw new Error("Cannot load page: no user");
  }

  const { exerciseId } = useParams();
  const [step, setStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  // Fetch exercise data
  const { exercise, finalStep, error } = useExercise(exerciseId!);
  if (error) {
    throw error;
  }

  // Derive values from exercise and current step
  const codeForStep = useMemo((): CodeForStep | null => {
    if (!exercise) return null;
    return getCodeForStep({
      title: exercise.title,
      questionTemplate: exercise.template,
      currentStep: step,
    });
  }, [exercise, step]);

  // Convenience variables from current exercise step and code
  const code = codeForStep?.code ?? "";
  const copyCode = codeForStep?.copyCode ?? "";
  const answers = codeForStep?.answers ?? [];
  const descriptions = exercise?.descriptions[step];
  const instructions = exercise?.instructions[step];
  const stepType = getStepType(step, finalStep);

  // Reset user answers when step changes
  useEffect(() => {
    setUserAnswers(Array(answers.length).fill(""));
  }, [step, answers.length]);

  // Check the user's answers against the correct answers; compute as derived state
  const checkAnswerResults = useMemo(() => {
    if (userAnswers.length === 0 || answers.length === 0) {
      return Array(answers.length).fill(null);
    }
    return checkAnswers(userAnswers, answers);
  }, [userAnswers, answers]);

  // Format exercise text content based on current step
  const { formattedDescription, formattedInstructions } = useExerciseText({
    stepType,
    description: descriptions,
    instructions: instructions,
  });

  const { buttons, exerciseComplete } = useNavigationButtons({
    stepType,
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
            canFocus={answers.length === 0}
            exerciseComplete={exerciseComplete}
          />
        </div>
        <ProgramOutput
          code={code}
          copyCode={copyCode}
          answers={answers}
          userAnswers={userAnswers}
          setUserAnswers={setUserAnswers}
          checkAnswerResults={checkAnswerResults}
        />
      </div>
    </div>
  );
};

export default ExercisePage;

// React and external libraries
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Internal
import Loading from "../../components/Loading";
import { useAuthContext } from "../../contexts/AuthContext";
import { checkAnswers } from "../../domain/answerChecker";
import { getCodeForStep, type CodeForStep } from "../../domain/templateParser";
import { userService } from "../../services/userService";
import { getStepType } from "../../types/StepType";
import styles from "./ExercisePage.module.css";
import ExerciseText from "./components/ExerciseText";
import NavigationButtons from "./components/NavigationButtons";
import ProgramOutput from "./components/ProgramOutput";
import { useExercise } from "./hooks/useExercise";
import { useExerciseText } from "./hooks/useExerciseText";
import { useNavigationButtons } from "./hooks/useNavigationButtons";

const ExercisePage = () => {
  const { user } = useAuthContext();
  // Should never happen because of ProtectedRoute logic
  if (!user) {
    throw new Error("Cannot load page: no user");
  }

  const { exerciseId } = useParams();
  const [step, setStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [checkAnswerResults, setCheckAnswerResults] = useState<
    (boolean | null)[]
  >([]);

  /* ************************
   * EFFECTS
   ************************ */
  // Fetch the exercise on mount.
  const { exercise, finalStep, error } = useExercise(exerciseId!);
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Set the appropriate number of input fields for the user's responses based
  // on the number of answers in the exercise.
  useEffect(() => {
    setUserAnswers(Array(answers.length).fill(""));
    setCheckAnswerResults(Array(answers.length).fill(null));
  }, [step]);

  // Check the user's answers against the correct answers; this will happen on
  // keyup of input fields
  useEffect(() => {
    if (userAnswers.length > 0 && answers.length > 0) {
      setCheckAnswerResults(checkAnswers(userAnswers, answers));
    }
  }, [userAnswers]);

  /* ********************************************************
   * STATE DERIVED FROM CURRENT STEP
   ******************************************************** */
  let codeForStep: CodeForStep | null = null;
  if (exercise) {
    codeForStep = getCodeForStep({
      title: exercise?.title ?? "",
      questionTemplate: exercise?.template ?? [],
      currentStep: step,
    });
  }
  const code = codeForStep?.code ?? "";
  const copyCode = codeForStep?.copyCode ?? "";
  const answers = codeForStep?.answers ?? [];
  const descriptions = exercise?.descriptions[step];
  const instructions = exercise?.instructions[step];
  const stepType = getStepType(step, finalStep);

  const getTitle = (): string => {
    return exercise ? `${exercise.title}` : "Loading Program...";
  };

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
        try {
          await userService.completeExercise(user.id, exerciseId!);
          setStep(() => step + 1);
        } catch (err) {
          console.error(err);
        }
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
      <h1 className={"title"}>{getTitle()}</h1>
      <div className={styles.container}>
        <div className={styles.instructions}>
          <ExerciseText
            description={formattedDescription}
            instructions={formattedInstructions}
          />
          {
            /* Don't show the buttons until we have an exercise loaded. */
            exercise && (
              <NavigationButtons
                buttons={buttons}
                exerciseComplete={exerciseComplete}
              />
            )
          }
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

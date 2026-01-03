// React and external libraries
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

// Internal
import { useAuthContext } from "../../contexts/AuthContext";
import { checkAnswers } from "../../domain/answerChecker";
import {
  getCodeForStep,
  getStepCount,
  type CodeForStep,
} from "../../domain/templateParser";
import { exerciseService } from "../../services/exerciseService";
import { userService } from "../../services/userService";
import { type Exercise as ExerciseType } from "../../types/Exercise";
import { getStepType } from "../../types/StepType";
import styles from "./ExercisePage.module.css";
import { ExerciseText } from "./components/ExerciseText";
import { NavigationButtons } from "./components/NavigationButtons";
import { ProgramOutput } from "./components/ProgramOutput";
import { useExerciseText } from "./hooks/useExerciseText";
import { useNavigationButtons } from "./hooks/useNavigationButtons";

const ExercisePage = () => {
  const { user } = useAuthContext();
  // Should never happen because of ProtectedRoute logic
  if (!user) {
    throw new Error("Cannot load page: no user");
  }

  const { exerciseId } = useParams();
  const [exercise, setExercise] = useState<ExerciseType | null>(null);
  const [step, setStep] = useState(0);
  const finalStep = useMemo(() => {
    if (!exercise) return 0;
    return getStepCount(exercise.template);
  }, [exercise]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [checkAnswerResults, setCheckAnswerResults] = useState<
    (boolean | null)[]
  >([]);

  // Cheat mode to get the step from the URL
  // Used for development only
  const [searchParams] = useSearchParams();
  const stepParam = searchParams.get("step");

  /* ************************
   * EFFECTS
   ************************ */
  // Fetch the exercise on mount.
  useEffect(() => {
    const fetchExercise = async () => {
      if (exerciseId === "preview") {
        // Preview mode for development. We'll never be here in prod.
        // This goes with the preview script/server.
        await fetchPreviewExercise();
        return;
      }

      // Normal prod exercise fetch
      await fetchFirestoreExercise();
    };

    fetchExercise();
  }, [exerciseId]);

  // Cheat mode to set the step from the URL
  // Used for development only
  useEffect(() => {
    if (exercise && stepParam !== null) {
      const requestedStep = parseInt(stepParam, 10);
      if (!isNaN(requestedStep)) {
        setStep(requestedStep);
      }
    }
  }, [exercise, stepParam]);

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

  /* ************************
   * HELPERS
   ************************ */
  // Development fetch from preview server
  const fetchPreviewExercise = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const filePath = params.get("path");

      // Die hard if no file path is provided
      if (!filePath) {
        throw new Error("No file path provided for preview");
      }

      // Fetch from the preview server API
      const response = await fetch(
        `http://localhost:3001/api/exercise?path=${encodeURIComponent(
          filePath
        )}`
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to load exercise: ${response.statusText}`
        );
      }

      const exerciseData = await response.json();
      setExercise(exerciseData as ExerciseType);
    } catch (err) {
      console.error("Error fetching preview exercise:", err);
    }
  };

  // Production fetch from Firestore
  const fetchFirestoreExercise = async () => {
    try {
      const exerciseData = await exerciseService.fetchById(exerciseId!);
      if (exerciseData) {
        setExercise(exerciseData);
      } else {
        console.error("Exercise not found in Firestore");
      }
    } catch (err) {
      console.error("Error fetching Firestore exercise:", err);
    }
  };

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

  // TODO: better loading state
  if (!exercise) {
    return <div>Loading...</div>;
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

// React and external libraries
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

// Internal
import { checkAnswers } from "../../domain/answerChecker";
import {
  getCodeForStep,
  getStepCount,
  type CodeForStep,
} from "../../domain/templateParser";
import { exerciseService } from "../../services/exerciseService";
import { type Exercise as ExerciseType } from "../../types/Exercise";
import { type User } from "../../types/User";
import styles from "./ExercisePage.module.css";
import { ExerciseText } from "./components/ExerciseText";
import { ProgramOutput } from "./components/ProgramOutput";
import { useExerciseText } from "./hooks/useExerciseText";

interface ExercisePageProps {
  user: User;
}

const ExercisePage = ({ user }: ExercisePageProps) => {
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

  const getTitle = (): string => {
    return exercise ? `${exercise.title}` : "Loading Program...";
  };

  // Format exercise text content based on current step
  const { formattedDescription, formattedInstructions } = useExerciseText({
    currentStep: step,
    finalStep,
    description: descriptions,
    instructions: instructions,
  });

  // const [codeForStep, setCodeForStep] = useState<CodeForStep | null>(null);
  // const [userInputNeedsChecked, setUserInputNeedsChecked] = useState(false);
  // const [exerciseState, setExerciseState] = useState<ExerciseState>("LOADING");

  // // Cheat mode to get the step from the URL
  // // Used for development only
  // const [searchParams] = useSearchParams();
  // const stepParam = searchParams.get("step");

  // // Get the max step in the template.
  // const finalStep = exercise ? Object.keys(exercise.descriptions).length : 0;

  /* ************************
   * EFFECTS
   ************************ */
  // Fetch the exercise on mount.
  useEffect(() => {
    const fetchExercise = async () => {
      // if (exerciseId === "preview") {
      //   // Preview mode for development. We'll never be here in prod.
      //   // This goes with the preview script/server.
      //   // await fetchPreviewExercise();
      //   return;
      // }

      // Normal prod exercise fetch
      console.log("fetching exercise");
      await fetchFirestoreExercise();
    };

    fetchExercise();
  }, [exerciseId]);

  // // Cheat mode to set the step from the URL
  // // Used for development only
  // useEffect(() => {
  //   if (exercise && stepParam !== null) {
  //     const requestedStep = parseInt(stepParam, 10);
  //     if (!isNaN(requestedStep)) {
  //       setStep(requestedStep);
  //     }
  //   }
  // }, [exercise, stepParam]);

  /* ************************
   * HELPERS
   ************************ */
  // Production fetch from Firestore
  const fetchFirestoreExercise = async () => {
    try {
      const exerciseData = await exerciseService.fetchById(exerciseId!);
      if (exerciseData) {
        setExercise(exerciseData);
        // setExerciseState("STEP_COMPLETE");
        console.log("exerciseData", exerciseData);
      } else {
        console.error("Exercise not found in Firestore");
        // setExerciseState("ERROR");
      }
    } catch (err) {
      console.error("Error fetching Firestore exercise:", err);
      // setExerciseState("ERROR");
    }
  };

  // Set the appropriate number of input fields for the user's responses based
  // on the number of answers in the exercise.
  useEffect(() => {
    setUserAnswers(Array(answers.length).fill(""));
    setCheckAnswerResults(Array(answers.length).fill(null));
  }, [step]);

  useEffect(() => {
    if (userAnswers.length > 0 && answers.length > 0) {
      setCheckAnswerResults(checkAnswers(userAnswers, answers));
    }
  }, [userAnswers]);

  // // Development fetch from preview server
  // const fetchPreviewExercise = async () => {
  //   try {
  //     const params = new URLSearchParams(window.location.search);
  //     const filePath = params.get("path");

  //     // Die hard if no file path is provided
  //     if (!filePath) {
  //       throw new Error("No file path provided for preview");
  //     }

  //     // Fetch from the preview server API
  //     const response = await fetch(
  //       `http://localhost:3001/api/exercise?path=${encodeURIComponent(
  //         filePath
  //       )}`
  //     );
  //     if (!response.ok) {
  //       const errorData = await response.json().catch(() => ({}));
  //       throw new Error(
  //         errorData.error || `Failed to load exercise: ${response.statusText}`
  //       );
  //     }

  //     const exerciseData = await response.json();
  //     setExercise(exerciseData as ExerciseType);
  //     setExerciseState("STEP_COMPLETE");
  //   } catch (err) {
  //     console.error("Error fetching preview exercise:", err);
  //     setExerciseState("ERROR");
  //   }
  // };

  /* ************************
   * HANDLERS
   ************************ */
  // const handleSubmit = async () => {
  // if (!user || !exerciseId) return;
  // setExerciseState("SUBMITTING");
  // try {
  //   await userService.completeExercise(user.id, exerciseId);
  //   setExerciseState("COMPLETED");
  // } catch (err) {
  //   setExerciseState("ERROR");
  //   console.error(err);
  // }
  // };

  /* ************************
   * UI
   ************************ */

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
            // /* Don't show the buttons until we have an exercise loaded. */
            // exercise && (
            //   <NavigationButtons
            //     currentStep={step}
            //     finalStep={finalStep}
            //     exerciseState={exerciseState}
            //     onPrevious={() => {
            //       setStep(step - 1);
            //     }}
            //     onNext={() => {
            //       setStep(step + 1);
            //     }}
            //     onCheck={() => setUserInputNeedsChecked(true)}
            //     onSubmit={handleSubmit}
            //   />
            // )
          }
        </div>
        <ProgramOutput
          code={code}
          copyCode={copyCode}
          answers={answers}
          userAnswers={userAnswers}
          setUserAnswers={setUserAnswers}
          checkAnswerResults={checkAnswerResults}
          // currentStep={step}
          // title={exercise?.title ?? "Loading Exercise..."}
          // setExerciseState={setExerciseState}
          // needsCheck={userInputNeedsChecked}
          // setNeedsCheck={setUserInputNeedsChecked}
          // questionTemplate={exercise?.template ?? ""}
        />
      </div>
      {/* Temp buttons to change the step */}
      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        <button onClick={() => setStep(step - 1)}>Previous</button>
        <button onClick={() => setStep(step + 1)}>Next</button>
      </div>
    </div>
  );
};

export default ExercisePage;

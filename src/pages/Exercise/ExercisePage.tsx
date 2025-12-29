// React and external libraries
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Services

// Internal
import { exerciseService } from "../../services/exerciseService";
import { type Exercise as ExerciseType } from "../../types/Exercise";
import { type User } from "../../types/User";
import styles from "./ExercisePage.module.css";

interface ExercisePageProps {
  user: User;
}

const ExercisePage = ({ user }: ExercisePageProps) => {
  // Get the exerciseId from the URL
  const { exerciseId } = useParams();
  const [exercise, setExercise] = useState<ExerciseType | null>(null);
  // const [step, setStep] = useState(0);
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
      if (exerciseId === "preview") {
        // Preview mode for development. We'll never be here in prod.
        // This goes with the preview script/server.
        // await fetchPreviewExercise();
        return;
      }

      // Normal prod exercise fetch
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

  // Production fetch from Firestore
  const fetchFirestoreExercise = async () => {
    try {
      const exerciseData = await exerciseService.fetchById(exerciseId!);
      if (exerciseData) {
        setExercise(exerciseData);
        console.log(exerciseData);
        // setExerciseState("STEP_COMPLETE");
      } else {
        console.error("Exercise not found in Firestore");
        // setExerciseState("ERROR");
      }
    } catch (err) {
      console.error("Error fetching Firestore exercise:", err);
      // setExerciseState("ERROR");
    }
  };

  /* ************************
   * HANDLERS
   ************************ */
  const handleSubmit = async () => {
    // if (!user || !exerciseId) return;
    // setExerciseState("SUBMITTING");
    // try {
    //   await userService.completeExercise(user.id, exerciseId);
    //   setExerciseState("COMPLETED");
    // } catch (err) {
    //   setExerciseState("ERROR");
    //   console.error(err);
    // }
  };

  /* ************************
   * UI
   ************************ */
  const getTitle = (): string => {
    return exercise ? `${exercise.title}` : "Loading Program...";
  };

  // Main content
  return (
    <div className={styles.exercise}>
      <h1 className={"title"}>{getTitle()}</h1>
      <div className={styles.container}>
        <div className={styles.instructions}>
          {/* <ExerciseText
            currentStep={step}
            finalStep={finalStep}
            descriptions={exercise ? exercise.descriptions : {}}
            instructions={exercise ? exercise.instructions : {}}
          /> */}
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
        {/* <ProgramOutput
          currentStep={step}
          title={exercise?.title ?? "Loading Exercise..."}
          setExerciseState={setExerciseState}
          needsCheck={userInputNeedsChecked}
          setNeedsCheck={setUserInputNeedsChecked}
          questionTemplate={exercise?.template ?? ""}
        /> */}
      </div>
    </div>
  );
};

export default ExercisePage;

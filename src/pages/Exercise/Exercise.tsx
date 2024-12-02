// React and external libraries
import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

// Internal
import styles from "./Exercise.module.css";
import type {
  Exercise as ExerciseType,
  ExerciseState,
} from "../../types/Exercise";
import { ExerciseText } from "./components/ExerciseText";
import { NavigationButtons } from "./components/NavigationButtons";
import { ProgramOutput } from "./components/ProgramOutput";
import { useExerciseCompletion } from "../../hooks/useExerciseCompletion";
import { User } from "../../types/User";

const Exercise = ({ user }: { user: User | null }) => {
  // Get the exerciseId from the URL
  const { exerciseId } = useParams();
  const [exercise, setExercise] = useState<ExerciseType | null>(null);
  const [step, setStep] = useState(0);
  const [userInputNeedsChecked, setUserInputNeedsChecked] = useState(false);
  const { completeExercise } = useExerciseCompletion();
  const [exerciseState, setExerciseState] = useState<ExerciseState>("LOADING");

  // Get the max step in the template.
  const finalStep = exercise
    ? Math.max(
        ...(Array.isArray(exercise.template)
          ? exercise.template.join("\n")
          : exercise.template
        )
          .split("\n")
          .map((line) => parseInt(line.split("?")[0]))
      )
    : 0;

  /* ************************
   * EFFECTS
   ************************ */
  useEffect(() => {
    // Fetch the exercise on mount.
    const fetchExercise = async () => {
      // Check if we're in preview mode
      if (exerciseId === "preview") {
        const params = new URLSearchParams(window.location.search);
        const previewData = params.get("data");
        if (previewData) {
          setExercise(JSON.parse(previewData));
          setExerciseState("STEP_COMPLETE");
          return;
        }
      }

      // Normal fetch from Firestore
      try {
        const exerciseRef = doc(db, "exercises", exerciseId!);
        const exerciseSnap = await getDoc(exerciseRef);
        if (exerciseSnap.exists()) {
          setExercise(exerciseSnap.data() as ExerciseType);
          setExerciseState("STEP_COMPLETE");
        } else {
          // TODO: Handle error
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  /* ************************
   * HANDLERS
   ************************ */
  const handleSubmit = async () => {
    if (!user || !exerciseId) return;

    setExerciseState("SUBMITTING");
    try {
      await completeExercise(user, exerciseId);
      setExerciseState("COMPLETED");
    } catch (err) {
      setExerciseState("ERROR");
      console.error(err);
    }
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
          <ExerciseText
            currentStep={step}
            finalStep={finalStep}
            descriptions={exercise ? exercise.descriptions : {}}
            instructions={exercise ? exercise.instructions : {}}
          />
          {
            /* Don't show the buttons until we have an exercise loaded. */
            exercise && (
              <NavigationButtons
                currentStep={step}
                finalStep={finalStep}
                exerciseState={exerciseState}
                onPrevious={() => {
                  setStep(step - 1);
                }}
                onNext={() => {
                  setStep(step + 1);
                }}
                onCheck={() => setUserInputNeedsChecked(true)}
                onSubmit={handleSubmit}
              />
            )
          }
        </div>
        <ProgramOutput
          currentStep={step}
          title={exercise?.title ?? "Loading Exercise..."}
          setExerciseState={setExerciseState}
          needsCheck={userInputNeedsChecked}
          setNeedsCheck={setUserInputNeedsChecked}
          questionTemplate={exercise?.template ?? ""}
        />
      </div>
    </div>
  );
};

export default Exercise;

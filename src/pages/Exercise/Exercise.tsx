// React and external libraries
import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

// Internal
import styles from "./Exercise.module.css";
import type { Exercise as ExerciseType } from "../../types/Exercise";
import { ExerciseText } from "./components/ExerciseText";
import { NavigationButtons } from "./components/NavigationButtons";
import { ProgramOutput } from "./components/ProgramOutput";

const Exercise = () => {
  // Get the exerciseId from the URL
  const { exerciseId } = useParams();

  const [exercise, setExercise] = useState<ExerciseType | null>(null);
  const [step, setStep] = useState(0);
  const [userInputNeedsChecked, setUserInputNeedsChecked] = useState(false);
  const [stepHasUnansweredQuestions, setStepHasUnansweredQuestions] =
    useState(false);

  // Get the max step in the template.
  const maxStep = exercise
    ? Math.max(
        ...exercise.template
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
      try {
        // TODO: Guard against undefined exerciseId
        const exerciseRef = doc(db, "exercises", exerciseId!);
        const exerciseSnap = await getDoc(exerciseRef);
        if (exerciseSnap.exists()) {
          setExercise(exerciseSnap.data() as ExerciseType);
        } else {
          // TODO: Handle error
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchExercise();
  }, []);

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
            step={step}
            maxStep={maxStep}
            descriptions={exercise ? exercise.descriptions : {}}
            instructions={exercise ? exercise.instructions : {}}
          />
          {
            /* Don't show the buttons until we have an exercise loaded. */
            exercise && (
              <NavigationButtons
                step={step}
                maxStep={maxStep}
                checkButtonVisible={stepHasUnansweredQuestions}
                onPrevious={() => {
                  setStep(step - 1);
                  setUserInputNeedsChecked(true);
                }}
                onNext={() => {
                  setStep(step + 1);
                  // This needs to be here so that the check button is visible.
                  setUserInputNeedsChecked(true);
                }}
                onCheck={() => setUserInputNeedsChecked(true)}
                onSubmit={() => {
                  console.log("submit");
                }}
              />
            )
          }
        </div>
        <ProgramOutput
          step={step}
          title={exercise?.title ?? "Loading Exercise..."}
          needsCheck={userInputNeedsChecked}
          onCheckComplete={(result: boolean) => {
            setStepHasUnansweredQuestions(result);
            setUserInputNeedsChecked(false);
          }}
          questionTemplate={exercise?.template ?? ""}
        />
      </div>
    </div>
  );
};

export default Exercise;

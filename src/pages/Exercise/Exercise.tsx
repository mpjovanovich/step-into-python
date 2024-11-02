// React and external libraries
import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

// Internal
import styles from "./Exercise.module.css";
import { BLANK_REGEX } from "../../constants";
import type { Exercise as ExerciseType } from "../../types/Exercise";
import { useExerciseState } from "./hooks/useExerciseState";
import { ExerciseText } from "./components/ExerciseText";
import { NavigationButtons } from "./components/NavigationButtons";
import { ProgramOutput } from "./components/ProgramOutput";

const Exercise = () => {
  // Get the exerciseId from the URL
  const { exerciseId } = useParams();

  // UI state
  const [programOutput, setProgramOutput] = useState("");

  // Exercise state - extracted into its own hook
  const [
    {
      exercise,
      step,
      currentTemplate,
      userAnswers,
      correctAnswers,
      solvedAnswers,
    },
    {
      setExercise,
      setStep,
      setCurrentTemplate,
      setUserAnswers,
      setCorrectAnswers,
      setSolvedAnswers,
    },
  ] = useExerciseState();

  /* ************************
   * FUNCTIONS
   ************************ */
  // Get the template based on the current step.
  // The user is shown all lines that are <= the step.
  // Answers are provided for lines that are < the step, since the user has
  // already answered them.
  const getTemplate = (step: number, includeTemplatedInput: boolean) => {
    let currentTemplate = `## EXERCISE: ${exercise?.title ?? ""}\n`;

    // Make a currentTemplate string that only includes lines up to the step.
    exercise?.template.split("\n").forEach((line) => {
      const [lineStep, code] = line.split("?");
      if (parseInt(lineStep) < step) {
        currentTemplate +=
          code.replaceAll("{{", "").replaceAll("}}", "") + "\n";
      } else if (parseInt(lineStep) === step) {
        if (includeTemplatedInput) {
          currentTemplate += code + "\n";

          // Remove anything in {{...}}
          currentTemplate += code.replace(/{{[^}]+}}/g, "") + "\n";
        }
      }
    });

    console.log(currentTemplate);
    return currentTemplate;
  };

  const handleCheckAnswer = () => {
    // Check against user responses.
    const answers = correctAnswers.map((answer, i) => {
      return answer === userAnswers[i];
    });
    setSolvedAnswers(answers);
  };

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

  // Every time the step changes, we need to:
  // - Update the template
  // - Update the answers
  // - Reset the user's input
  // - Update the solvedAnswers
  useEffect(() => {
    // Update everything based on the new template.
    const template = getTemplate(step, true);
    const answers =
      template.match(BLANK_REGEX)?.map((p) => p.slice(2, -2)) || [];
    setCurrentTemplate(template);
    setCorrectAnswers(answers);

    // Reset the user's input.
    setUserAnswers(Array(answers.length).fill(""));
    setSolvedAnswers(
      // If there are no answers, we don't want to show the Check button,
      // so we'll set solvedAnswers to [true].
      answers.length === 0 ? [true] : Array(answers.length).fill(null)
    );

    setProgramOutput(getTemplate(step, false).trim());
  }, [step, exercise]);

  /* ************************
   * UI
   ************************ */
  const getTitle = (): string => {
    return exercise
      ? `${exercise.course} - ${exercise.title}`
      : "Loading Program...";
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
                solvedAnswers={solvedAnswers}
                onPrevious={() => setStep(step - 1)}
                onNext={() => {
                  setStep(step + 1);
                  setSolvedAnswers(Array(userAnswers.length).fill(false));
                }}
                onCheck={handleCheckAnswer}
                onSubmit={() => {
                  console.log("Submit");
                }}
              />
            )
          }
        </div>
        <ProgramOutput
          programOutput={programOutput}
          questionTemplate={currentTemplate}
          correctAnswers={correctAnswers}
          userAnswers={userAnswers}
          solvedAnswers={solvedAnswers}
          setUserAnswers={setUserAnswers}
        />
      </div>
    </div>
  );
};

export default Exercise;

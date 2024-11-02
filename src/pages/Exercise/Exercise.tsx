// React and external libraries
import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { FiCopy, FiCheck } from "react-icons/fi";
// Internal
import type { Exercise as ExerciseType } from "../../types/Exercise";
import { QuizQuestion } from "./components/QuizQuestion";
import { useExerciseState } from "./hooks/useExerciseState";
import { BLANK_REGEX } from "../../constants";
import styles from "./Exercise.module.css";
import { NavigationButtons } from "./components/NavigationButtons";

const Exercise = () => {
  // TEMP
  const exerciseId = "fnIN98zNyOamSububVC1";

  // UI state
  const [programOutput, setProgramOutput] = useState("");
  const [copyText, setCopyText] = useState("Copy");

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
        } else {
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
        const exerciseRef = doc(db, "exercises", exerciseId);
        const exerciseSnap = await getDoc(exerciseRef);
        if (exerciseSnap.exists()) {
          setExercise(exerciseSnap.data() as ExerciseType);
        } else {
          console.log("Exercise not found");
          // setError('Exercise not found');
        }
      } catch (err) {
        console.error(err);
        // setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        // setLoading(false);
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
  const getDescription = (): JSX.Element => {
    if (step === 0) {
      return (
        <>
          <p>
            In this exercise you will complete a Python program step by step.
          </p>
          <p>
            The code window on the right will show the code for the current
            step. It will sometimes have a section for you to complete.
          </p>
          <p>
            At any step you may use the "Copy" button from the code window and
            paste the output into VS Code or another Python interpreter to see
            the current output. This can help with debugging and understanding
            the flow of execution.
          </p>
        </>
      );
    } else if (step === maxStep + 1) {
      return (
        <>
          <p>
            Your program is complete. Try copying and pasting it into a Python
            interpreter to see if it works!
          </p>
          <p>Make sure to click Submit!</p>
        </>
      );
    }

    return exercise?.descriptions[step] ? (
      <p>{exercise.descriptions[step]}</p>
    ) : (
      <></>
    );
  };

  const getInstructions = (): string => {
    if (step === maxStep + 1) {
      return "Click Submit";
    }
    return exercise?.instructions[step] ?? "Click Next to continue";
  };

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
          <h3>Description</h3>
          {getDescription()}
          <h3>Instructions</h3>
          <p>{getInstructions()}</p>
          {
            /* Don't show the buttons until we have an exercise loaded. */
            exercise && (
              <NavigationButtons
                step={step}
                maxStep={maxStep}
                solvedAnswers={solvedAnswers}
                userAnswers={userAnswers}
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
        <div className={styles.output}>
          <button
            className={styles.copyButton}
            onClick={() => {
              navigator.clipboard.writeText(programOutput);
              setCopyText("Copied!");
              setTimeout(() => setCopyText("Copy"), 800);
            }}
          >
            {copyText === "Copied!" ? <FiCheck /> : <FiCopy />} {copyText}
          </button>
          <QuizQuestion
            questionTemplate={currentTemplate}
            correctAnswers={correctAnswers}
            userAnswers={userAnswers}
            solvedAnswers={solvedAnswers}
            setUserAnswers={setUserAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default Exercise;

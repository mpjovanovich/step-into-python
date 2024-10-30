import React, { useState, useEffect } from "react";
import { QuizQuestion } from "./components/QuizQuestion";
import { BLANK_REGEX } from "./constants";
import styles from "./App.module.css";

const App = () => {
  /* ************************
   * STATE
   ************************ */
  // This is the current step in the multistep program.
  const [step, setStep] = useState(0);
  // This is the current template that the user is answering.
  const [currentTemplate, setCurrentTemplate] = useState("");
  // Since there may be several answers in a given template, we'll use an array
  // instead of one string to store state for the user's answers.
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  // Store the correct answers for each template in an array.
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  // Use an array of booleans to track correctness for each answer in the template.
  const [solvedAnswers, setSolvedAnswers] = useState<(boolean | null)[]>([]);
  // This is the program output that the user is building.
  const [programOutput, setProgramOutput] = useState("");
  const [copyText, setCopyText] = useState("Copy");

  /* ************************
   * CONSTANTS
   ************************ */

  interface Exercise {
    descriptions: { [key: number]: string };
    instructions: { [key: number]: string };
    template: string;
  }

  const exercise: Exercise = {
    descriptions: {
      1: "First we'll print some basic messages",
      2: "Now let's greet our closest neighbor",
      3: "Finally, let's say hello to our star",
    },
    instructions: { 3: "Fill in the blank with the name of the star." },
    template: `1?print("BEGIN PROGRAM")
  1?print("Hello, earth!")
  2?print("Hello, moon!")
  3?print("Hello, {{sun}}!")
  1?print("END PROGRAM")`,
  };

  /* ************************
   * FUNCTIONS
   ************************ */
  // Get the template based on the current step.
  // The user is shown all lines that are <= the step.
  // Answers are provided for lines that are < the step, since the user has
  // already answered them.
  const getTemplate = (step: number, includeTemplatedInput: boolean) => {
    let currentTemplate = "";

    // Make a currentTemplate string that only includes lines up to the step.
    exercise.template.split("\n").map((line) => {
      const [lineStep, code] = line.split("?");
      if (parseInt(lineStep) < step) {
        currentTemplate += code.replace("{{", "").replace("}}", "") + "\n";
      } else if (parseInt(lineStep) === step) {
        if (includeTemplatedInput) {
          currentTemplate += code + "\n";
        } else {
          // Remove anything in {{...}}
          currentTemplate += code.replace(/{{[^}]+}}/g, "") + "\n";
        }
      }
    });

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
  const maxStep = Math.max(
    ...exercise.template.split("\n").map((line) => parseInt(line.split("?")[0]))
  );

  /* ************************
   * EFFECTS
   ************************ */
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
  }, [step]);

  /* ************************
   * UI
   ************************ */
  const renderActionButton = () => {
    if (solvedAnswers.every((correct) => correct) && step === maxStep + 1) {
      return <button onClick={handleCheckAnswer}>Submit</button>;
    }

    if (solvedAnswers.every((correct) => correct) && step <= maxStep) {
      return (
        <button
          onClick={() => {
            setStep(step + 1);
            setSolvedAnswers(Array(userAnswers.length).fill(false));
          }}
        >
          Next
        </button>
      );
    }

    if (solvedAnswers.some((correct) => !correct)) {
      return <button onClick={handleCheckAnswer}>Check</button>;
    }

    return null;
  };

  const getDescription = () => {
    if (step === 0) {
      return (
        <>
          <p>
            In this exercise you will complete a Python program step by step.
          </p>
          <p>
            The Development Code window will show the code for the current step.
            It will sometimes have a section for you to complete.
          </p>
          <p>
            The Current Program window will show your progress up to the current
            step. At each step you may use the "Copy" button from the Current
            Program window and paste into VS Code or another Python interpreter
            to see the current output.
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
    return exercise.descriptions[step] && <p>{exercise.descriptions[step]}</p>;
  };

  const getInstructions = () => {
    if (step === maxStep + 1) {
      return <p>Click Submit</p>;
    }
    return exercise.instructions[step] ?? "Click Next to continue";
  };

  // Main content
  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Python Operator Quiz</h1>
      <div className={styles.container}>
        <div className={styles.containerContent}>
          <h3>Description</h3>
          {getDescription()}
          <h3>Instructions</h3>
          <p>{getInstructions()}</p>
          {renderActionButton()}
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.column}>
          <h3>Development Code</h3>
          <div className={`${styles.template} ${styles.containerContent}`}>
            <QuizQuestion
              questionTemplate={currentTemplate}
              userAnswers={userAnswers}
              solvedAnswers={solvedAnswers}
              setUserAnswers={setUserAnswers}
            />
          </div>
        </div>

        <div className={styles.column}>
          <h3>Current Program</h3>
          <div className={styles.output}>
            <button
              className={styles.copyButton}
              onClick={() => {
                navigator.clipboard.writeText(programOutput);
                setCopyText("Copied!");
                setTimeout(() => setCopyText("Copy"), 2000);
              }}
            >
              {copyText}
            </button>
            <pre>{programOutput}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

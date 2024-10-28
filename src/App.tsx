import React, { useState, useEffect } from "react";
import { QuizQuestion } from "./components/QuizQuestion";
import { BLANK_REGEX } from "./constants";
import styles from "./App.module.css";

const App = () => {
  /* ************************
   * STATE
   ************************ */
  // This is the current step in the multistep program.
  const [step, setStep] = useState(1);
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
  // This will be encoded in a JSON serialized map.
  // For this prototype we'll just hardcode it.
  //   const questionTemplate = `1?print("BEGIN PROGRAM")
  // 1?print("Hello, earth!")
  // 2?print("Hello, moon!")
  // 3?print("Hello, {{sun}}!")
  // 1?print("END PROGRAM")`;
  const questionTemplate = `1?print("BEGIN PROGRAM")
1?print("Hello, {{sun}}!")
1?print("END PROGRAM")`;

  // Get the max step in the template.
  const maxStep = Math.max(
    ...questionTemplate.split("\n").map((line) => parseInt(line.split("?")[0]))
  );

  /* ************************
   * FUNCTIONS
   ************************ */
  // Get the template based on the current step.
  // The user is shown all lines that are <= the step.
  // Answers are provided for lines that are < the step, since the user has
  // already answered them.
  const getTemplate = (step: number, includeCurrentStep: boolean) => {
    let currentTemplate = "";

    // Make a currentTemplate string that only includes lines up to the step.
    questionTemplate.split("\n").map((line) => {
      const [lineStep, code] = line.split("?");
      if (parseInt(lineStep) < step) {
        currentTemplate += code.replace("{{", "").replace("}}", "") + "\n";
      } else if (parseInt(lineStep) === step && includeCurrentStep) {
        currentTemplate += code + "\n";
      }
    });

    return currentTemplate;
  };

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

  const handleCheckAnswer = () => {
    // Check against user responses.
    const answers = correctAnswers.map((answer, i) => {
      return answer === userAnswers[i];
    });
    setSolvedAnswers(answers);
  };

  /* ************************
   * UI
   ************************ */
  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Python Operator Quiz</h1>
      <div className={styles.container}>
        <div className={styles.column}>
          <h2>Development Code</h2>
          <div className={styles.template}>
            <QuizQuestion
              questionTemplate={currentTemplate}
              userAnswers={userAnswers}
              solvedAnswers={solvedAnswers}
              setUserAnswers={setUserAnswers}
            />
            {/* Show if any answer is incorrect or incomplete. */}
            {solvedAnswers.some((correct) => !correct) && (
              <button onClick={handleCheckAnswer}>Check</button>
            )}
            {/* Show if all answers are correct and there are more questions. */}
            {solvedAnswers.every((correct) => correct) && step <= maxStep && (
              <button
                onClick={() => {
                  setStep(step + 1);
                  setSolvedAnswers(Array(userAnswers.length).fill(false));
                }}
              >
                Next
              </button>
            )}
            {/* Show submit button if it's the last question. */}
            {solvedAnswers.every((correct) => correct) &&
              step === maxStep + 1 && (
                <button onClick={handleCheckAnswer}>Submit</button>
              )}
          </div>
        </div>

        <div className={styles.column}>
          <h2>Complete Program</h2>
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

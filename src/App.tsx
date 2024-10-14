import React, { useState, useEffect } from "react";
import { QuizQuestion } from "./components/QuizQuestion";
import { BLANK_REGEX } from "./constants";

const App = () => {
  /* ************************
   * STATE
   ************************ */
  // This is the current step in the multistep program.
  const [step, setStep] = useState(1);
  // This is the current template that the user is answering.
  const [currentTemplate, setCurrentTemplate] = useState("");
  // Since there may be several answers, we'll use an array instead of one
  // string to store state for the user's answers.
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  // Store the correct answers for each question in an array.
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  // Use an array of booleans to track correctness for each answer
  const [solvedAnswers, setSolvedAnswers] = useState<boolean[]>([]);

  /* ************************
   * CONSTANTS
   ************************ */
  // This will be encoded in a JSON serialized map.
  // For this prototype we'll just hardcode it.
  const questionTemplate = `1?print("BEGIN PROGRAM")
1?print("Hello, {{sun}}!")
2?print("Hello, earth!")
3?print("Hello, moon!")
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
  const getCurrentTemplate = () => {
    let currentTemplate = "";

    // Make a currentTemplate string that only includes lines up to the step.
    questionTemplate.split("\n").map((line) => {
      const [lineStep, code] = line.split("?");
      if (parseInt(lineStep) <= step) {
        // If this line is < the step then we need to unwrap the answer in the {{}}
        if (parseInt(lineStep) < step) {
          currentTemplate += code.replace("{{", "").replace("}}", "") + "\n";
        } else {
          currentTemplate += code + "\n";
        }
      }
    });

    return currentTemplate;
  };

  useEffect(() => {
    const template = getCurrentTemplate();
    const answers =
      template.match(BLANK_REGEX)?.map((p) => p.slice(2, -2)) || [];

    setCurrentTemplate(template);
    setCorrectAnswers(answers);
    setUserAnswers(Array(answers.length).fill(""));
    setSolvedAnswers(
      // If there are no answers, we don't want to show the Check button,
      // so we'll set solvedAnswers to [true].
      answers.length === 0 ? [true] : Array(answers.length).fill(false)
    );
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
    <div className="App" style={styles.app}>
      <h1 style={styles.title}>Python Operator Quiz</h1>
      <div style={styles.container}>
        <div style={styles.column}>
          <h2>Development Code</h2>
          <QuizQuestion
            questionTemplate={currentTemplate}
            userAnswers={userAnswers}
            setUserAnswers={setUserAnswers}
          />
          {/* Show if any answer is incorrect or incomplete. */}
          {solvedAnswers.some((correct) => !correct) && (
            <button onClick={handleCheckAnswer}>Check</button>
          )}
          {/* Show if all answers are correct and there are more questions. */}
          {solvedAnswers.every((correct) => correct) && step < maxStep && (
            <button
              onClick={() => {
                setStep(step + 1);
                // setSolvedAnswers(false);
                setSolvedAnswers(Array(userAnswers.length).fill(false));
              }}
            >
              Next
            </button>
          )}
          {/* Show submit button if it's the last question. */}
          {solvedAnswers.every((correct) => correct) && step === maxStep && (
            <button onClick={handleCheckAnswer}>Submit</button>
          )}
        </div>

        <div style={styles.column}>
          <h2>Complete Program</h2>
          <div style={styles.output}></div>
        </div>
      </div>
    </div>
  );
};

export default App;

/* ************************
 * STYLES
 ************************ */
const styles = {
  app: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
  },
  title: {
    textAlign: "center" as const,
    color: "#333",
  },
  container: {
    display: "flex",
    gap: "20px",
  },
  column: {
    flex: 1,
  },
  output: {
    backgroundColor: "#f4f4f4",
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "10px",
    fontFamily: "monospace",
    whiteSpace: "pre-wrap" as const,
    minHeight: "100px",
  },
  timestamp: {
    marginTop: "10px",
    fontSize: "0.8em",
    color: "#666",
  },
};

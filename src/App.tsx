import React, { useState, useEffect } from "react";
import { QuizQuestion } from "./components/QuizQuestion";
import { BLANK_REGEX } from "./constants";

const App = () => {
  // Since there may be several answers, we'll use an array instead of one
  // string to store state for the user's answers.
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [step, setStep] = useState(1);

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

  const currentTemplate = getCurrentTemplate();

  // Sometimes there are no blanks in the template.
  // If this is the case then we show the "Next" button instead of the "Check" button.
  useEffect(() => {
    const blanks = currentTemplate.match(BLANK_REGEX);
    if (!blanks || blanks.length === 0) {
      setIsCorrect(true);
    }
  }, [currentTemplate]);

  const handleCheckAnswer = () => {
    // Answers to the current question.
    const answers =
      questionTemplate.match(BLANK_REGEX)?.map((p) => p.slice(2, -2)) || [];

    // Check against user responses.
    const isCorrect =
      answers.length === userAnswers.length &&
      answers.every((answer, i) => answer === userAnswers[i]);

    setIsCorrect(isCorrect);
    console.log("Answer is", isCorrect ? "correct" : "incorrect");
  };

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

          {/* Show if the answer is incorrect or incomplete. */}
          {!isCorrect && <button onClick={handleCheckAnswer}>Check</button>}

          {/* Show if the answer is correct and there are more questions. */}
          {isCorrect && step < maxStep && (
            <button
              onClick={() => {
                setStep(step + 1);
                setIsCorrect(false);
              }}
            >
              Next
            </button>
          )}

          {/* Show submit button if it's the last question. */}
          {isCorrect && step === maxStep && (
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

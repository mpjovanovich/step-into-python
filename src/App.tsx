import React, { useState, useEffect } from "react";
import { QuizQuestion } from "./components/QuizQuestion";

const App = () => {
  // Since there may be several answers, we'll use an array instead of one
  // string to store state for the user's answers.
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [step, setStep] = useState(1);

  // This will be encoded in a JSON serialized map.
  // For this prototype we'll just hardcode it.
  const templateCode = `print("Hello, {{sun}}!")
print("Hello, moon!")
`;
  // const codeMapString = JSON.stringify(codeMap);
  const codeMap: Map<Number, String> = new Map([[1, templateCode]]);

  const handleCheckAnswer = () => {
    // Answers to the current question.
    const questionTemplate = codeMap.get(step)?.toString() ?? "";
    const answers =
      questionTemplate.match(/{{(.*?)}}/g)?.map((p) => p.slice(2, -2)) || [];

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
            questionTemplate={codeMap.get(step)?.toString() ?? ""}
            userAnswers={userAnswers}
            setUserAnswers={setUserAnswers}
          />

          {/* Show if the answer is incorrect or incomplete. */}
          {!isCorrect && <button onClick={handleCheckAnswer}>Check</button>}

          {/* Show if the answer is correct and there are more questions. */}
          {isCorrect && step < codeMap.size && (
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
          {isCorrect && step === codeMap.size && (
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

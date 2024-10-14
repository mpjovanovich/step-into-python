import { useState, useEffect } from "react";
import { QuizQuestion } from "./components/QuizQuestion";

const App = () => {
  const [step, setStep] = useState(1);

  // This will be encoded in a JSON serialized map.
  // For this prototype we'll just hardcode it.
  const templateCode = `print("Hello, {{sun}}!")
print("Hello, moon!")
`;

  const codeMap: Map<Number, String> = new Map([[1, templateCode]]);

  // Serialize the map into a string.
  const codeMapString = JSON.stringify(codeMap);
  // console.log(Object.fromEntries(codeMap));

  return (
    <div className="App" style={styles.app}>
      <h1 style={styles.title}>Python Operator Quiz</h1>
      <div style={styles.container}>
        <div style={styles.column}>
          <h2>Development Code</h2>
          <QuizQuestion
            questionTemplate={codeMap.get(step)?.toString() ?? ""}
          />
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

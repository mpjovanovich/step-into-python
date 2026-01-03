import React, { useState } from "react";
import { MdCheck, MdContentCopy } from "react-icons/md";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { BLANK_REGEX } from "../../../constants";
import styles from "../ExercisePage.module.css";

interface ProgramOutputProps {
  code: string;
  copyCode: string;
  answers: string[];
  userAnswers: string[];
  setUserAnswers: (userAnswers: string[]) => void;
  checkAnswerResults: (boolean | null)[];
}

const renderTemplate = (
  code: string,
  answers: string[],
  userAnswers: string[],
  setUserAnswers: (userAnswers: string[]) => void,
  checkAnswerResults: (boolean | null)[]
) => {
  // Split the template into parts at each blank placeholder.
  const parts = code.split(BLANK_REGEX);

  // Stubs in an input field for each @@ in the template
  return parts.map((part, i) => (
    <React.Fragment key={i}>
      <SyntaxHighlighter
        language="python"
        style={vscDarkPlus}
        customStyle={{
          display: "inline",
          padding: "0 4px",
          background: "transparent",
        }}
        codeTagProps={{
          style: {
            fontSize: "1.0rem",
          },
        }}
      >
        {/* The readonly part of the template */}
        {part}
      </SyntaxHighlighter>
      {/* The input field for the user's answer */}
      {/* Don't render for the last part in the template */}
      {i < parts.length - 1 && (
        <span className="inline-flex-wrapper">
          <input
            type="text"
            value={userAnswers[i] ?? ""}
            onChange={(e) => {
              // This spreads the current answers into a new array so that we
              // can mutate it, updates the answer at the current index, and
              // sets the new array as state for the user's answers.
              const newAnswers = [...userAnswers];
              newAnswers[i] = e.target.value;
              setUserAnswers(newAnswers);
            }}
            autoFocus={i === 0}
            style={{ width: `${answers[i]?.length * 10 + 20}px` }}
          />
          <span
            style={{
              marginLeft: "5px",
            }}
          >
            {checkAnswerResults[i] === true && (
              <MdCheck color="green" style={{ fontSize: "1.2rem" }} />
            )}
          </span>
        </span>
      )}
    </React.Fragment>
  ));
};

const ProgramOutput = ({
  code,
  copyCode,
  answers,
  userAnswers,
  setUserAnswers,
  checkAnswerResults,
}: ProgramOutputProps) => {
  const [copyText, setCopyText] = useState("Copy");

  return (
    <div className={styles.output}>
      <button
        className={styles.copyButton}
        onClick={() => {
          navigator.clipboard.writeText(copyCode);
          setCopyText("Copied!");
          setTimeout(() => setCopyText("Copy"), 800);
        }}
      >
        {copyText === "Copied!" ? <MdCheck /> : <MdContentCopy />} {copyText}
      </button>
      <div>
        <pre>
          <code>
            {renderTemplate(
              code,
              answers,
              userAnswers,
              setUserAnswers,
              checkAnswerResults
            )}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default ProgramOutput;

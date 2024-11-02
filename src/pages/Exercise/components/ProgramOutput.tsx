import React, { useEffect, useState } from "react";
import { BLANK_REGEX } from "../../../constants";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiCheck, FiCopy, FiX } from "react-icons/fi";
import styles from "../Exercise.module.css";

interface ProgramOutputProps {
  step: number;
  title: string;
  questionTemplate: string;
  needsCheck: boolean;
  onCheckComplete: (result: boolean) => void;
}

/* **********************************************************************
 * This has the fill-in-the-blank code functionality, as well as the
 * "Check" button to see if the answer is correct.
 ************************************************************************/
const ProgramOutput = ({
  step,
  title,
  questionTemplate,
  needsCheck,
  onCheckComplete,
}: ProgramOutputProps) => {
  const [copyText, setCopyText] = useState("Copy");
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [userAnswerResults, setUserAnswerResults] = useState<
    (boolean | null)[]
  >([]);

  useEffect(() => {
    if (needsCheck) {
      checkAnswers();
    }
  }, [needsCheck]);

  interface Template {
    code: string;
    copyCode: string;
    answers: string[];
  }

  const checkAnswers = () => {
    const results = template.answers.map((answer, i) =>
      userAnswers[i] ? answer === userAnswers[i] : null
    );
    setUserAnswerResults(results);

    // If there are no questions, this will still work.
    onCheckComplete(results.some((answer) => !answer));
  };

  const getTemplate = (step: number): Template => {
    let template = `## EXERCISE: ${title}\n`;
    let answers: string[] = [];

    // Make a currentTemplate string that only includes lines up to the step.
    questionTemplate.split("\n").forEach((line) => {
      const [lineStep, code] = line.split("?");
      if (parseInt(lineStep) < step) {
        template += code.replaceAll("{{", "").replaceAll("}}", "") + "\n";
      } else if (parseInt(lineStep) === step) {
        template += code + "\n";

        // Use the regex to find the answers in the code.
        let matches = code.match(BLANK_REGEX);
        if (matches) {
          // Strip the {{ and }} from the answers
          const mapped = matches.map((p) => p.slice(2, -2));
          answers.push(...mapped);
        }
      }
    });

    return {
      code: template,
      copyCode: template.replace(/{{[^}]+}}/g, ""),
      answers: answers,
    };
  };

  const renderTemplate = () => {
    /* *************************************
     * Render lines of code that are not the current step.
     **************************************/
    // Split the template into parts at each blank placeholder.
    const parts = template.code.split(BLANK_REGEX);

    // Stubs in an input field for each {{}} in the template
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
          <>
            <input
              type="text"
              value={userAnswers[i] || ""}
              onChange={(e) => {
                // this spreads the current answers into a new array so that we
                // can mutate it, updates the answer at the current index, and
                // sets the new array as state for the user's answers.
                const newAnswers = [...userAnswers];
                newAnswers[i] = e.target.value;
                setUserAnswers(newAnswers);
              }}
              // todo: focus on this if user missed a question
              autoFocus={i === 0}
              style={{ width: `${template.answers[i]?.length * 10 + 20}px` }}
            />
            <span
              style={{
                marginLeft: "5px",
              }}
            >
              {userAnswerResults[i] === true && <FiCheck color="green" />}
              {userAnswerResults[i] === false && <FiX color="red" />}
            </span>
          </>
        )}
      </React.Fragment>
    ));
  };

  const template = getTemplate(step);

  return (
    <div className={styles.output}>
      <button
        className={styles.copyButton}
        onClick={() => {
          navigator.clipboard.writeText(template.copyCode);
          setCopyText("Copied!");
          setTimeout(() => setCopyText("Copy"), 800);
        }}
      >
        {copyText === "Copied!" ? <FiCheck /> : <FiCopy />} {copyText}
      </button>

      <div>
        <pre>
          <code>{renderTemplate()}</code>
        </pre>
      </div>
    </div>
  );
};

export { ProgramOutput };

import React, { useEffect, useState } from "react";
import { BLANK_REGEX } from "../../../constants";
import { ExerciseState } from "../../../types/Exercise";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { MdCheck, MdContentCopy, MdClose } from "react-icons/md";
import styles from "../Exercise.module.css";

// Types and Interfaces
interface Template {
  code: string;
  copyCode: string;
  answers: string[];
}

interface ProgramOutputProps {
  currentStep: number;
  title: string;
  questionTemplate: string;
  needsCheck: boolean;
  setNeedsCheck: (needsCheck: boolean) => void;
  setExerciseState: (state: ExerciseState) => void;
}

/* **********************************************************************
 * This has the fill-in-the-blank code functionality, as well as the
 * "Check" button to see if the answer is correct.
 ************************************************************************/
const ProgramOutput = ({
  currentStep,
  title,
  questionTemplate,
  needsCheck,
  setNeedsCheck,
  setExerciseState,
}: ProgramOutputProps) => {
  // Helper functions
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

  // State
  const [copyText, setCopyText] = useState("Copy");
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [userAnswerResults, setUserAnswerResults] = useState<
    (boolean | null)[]
  >([]);

  // Template initialization
  const template = getTemplate(currentStep);

  // Technically this doesn't belong here since this is a view, but I'm keeping
  // it here for now.
  const checkAnswers = () => {
    const results = template.answers.map((answer, i) =>
      userAnswers[i] ? answer === userAnswers[i] : null
    );
    setUserAnswerResults(results);

    // If there are no questions, this will still work.
    const hasUnansweredQuestions = results.some((answer) => !answer);
    setExerciseState(
      hasUnansweredQuestions ? "STEP_INCOMPLETE" : "STEP_COMPLETE"
    );
    setNeedsCheck(false);
  };

  // Effects
  useEffect(() => {
    checkAnswers();
  }, [currentStep]);

  useEffect(() => {
    if (needsCheck) {
      checkAnswers();
    }
  }, [needsCheck]);

  // Render helpers
  const renderTemplate = () => {
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
          <span className="inline-flex-wrapper">
            <input
              type="text"
              value={userAnswers[i] || ""}
              onChange={(e) => {
                // This spreads the current answers into a new array so that we
                // can mutate it, updates the answer at the current index, and
                // sets the new array as state for the user's answers.
                const newAnswers = [...userAnswers];
                newAnswers[i] = e.target.value;
                setUserAnswers(newAnswers);
              }}
              autoFocus={i === 0}
              style={{ width: `${template.answers[i]?.length * 10 + 20}px` }}
            />
            <span
              style={{
                marginLeft: "5px",
              }}
            >
              {userAnswerResults[i] === true && (
                <MdCheck color="green" style={{ fontSize: "1.2rem" }} />
              )}
              {userAnswerResults[i] === false && (
                <MdClose color="red" style={{ fontSize: "1.2rem" }} />
              )}
            </span>
          </span>
        )}
      </React.Fragment>
    ));
  };

  // Render
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
        {copyText === "Copied!" ? <MdCheck /> : <MdContentCopy />} {copyText}
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

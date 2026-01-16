import CodeCopyButton from "@/pages/Exercise/components/CodeCopyButton";
import CodeHighlight from "@/pages/Exercise/components/CodeHighlight";
import CodeInput from "@/pages/Exercise/components/CodeInput";
import CodeInputResult from "@/pages/Exercise/components/CodeInputResult";
import styles from "@/pages/Exercise/ExercisePage.module.css";
import { splitTemplateIntoParts } from "@/pages/Exercise/utils/ProgramOutputUtils";
import React from "react";

const ProgramOutput = ({
  code,
  copyCode,
  answers,
  userAnswers,
  setUserAnswers,
  checkAnswerResults,
}: {
  code: string;
  copyCode: string;
  answers: string[];
  userAnswers: string[];
  setUserAnswers: (userAnswers: string[]) => void;
  checkAnswerResults: (boolean | null)[];
}) => {
  const parts = splitTemplateIntoParts(code);

  return (
    <div className={styles.output}>
      <CodeCopyButton copyCode={copyCode} />
      <pre>
        <code>
          {parts.map((part, i) => (
            <React.Fragment key={i}>
              {/* The readonly part of the template */}
              {part.type === "code" && <CodeHighlight code={part.value} />}

              {/* The input field for the user's answer */}
              {part.type === "input" && (
                <span className="inline-flex-wrapper">
                  <CodeInput
                    value={userAnswers[part.answerIndex] ?? ""}
                    answer={answers[part.answerIndex] ?? ""}
                    autoFocus={part.answerIndex === 0}
                    onChange={(e) => {
                      // This spreads the current answers into a new array so that we
                      // can mutate it, updates the answer at the current index, and
                      // sets the new array as state for the user's answers.
                      const newAnswers = [...userAnswers];
                      newAnswers[part.answerIndex] = e.target.value;
                      setUserAnswers(newAnswers);
                    }}
                  />
                  <CodeInputResult
                    result={checkAnswerResults[part.answerIndex] === true}
                  />
                </span>
              )}
            </React.Fragment>
          ))}
        </code>
      </pre>
    </div>
  );
};

export default ProgramOutput;

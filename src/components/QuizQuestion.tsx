import React, { useRef, useEffect } from "react";
import { BLANK_REGEX } from "../constants";

interface QuizQuestionProps {
  questionTemplate: string;
  userAnswers: string[];
  solvedAnswers: (boolean | null)[];
  setUserAnswers: (answers: string[]) => void;
}

/* **********************************************************************
 * This has the fill-in-the-blank code functionality, as well as the
 * "Check" button to see if the answer is correct.
 ************************************************************************/
const QuizQuestion = ({
  questionTemplate,
  userAnswers,
  solvedAnswers,
  setUserAnswers,
}: QuizQuestionProps) => {
  const renderTemplate = () => {
    /* *************************************
     * Render lines of code that are not the current step.
     **************************************/
    // Split the template into parts at each blank placeholder.
    const parts = questionTemplate.split(BLANK_REGEX);

    // Stubs in an input field for each {{}} in the template
    return parts.map((part, i) => (
      <React.Fragment key={i}>
        {/* The readonly part of the template */}
        {part}
        {/* The input field for the user's answer */}
        {/* Don't render for the last part in the template */}
        {i < parts.length - 1 && (
          <>
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
              // TODO: focus on this if user missed a question
              autoFocus={i === 0}
              style={{ width: "120px" }}
            />
            <span style={{ marginLeft: "5px" }}>
              {/* Apparently you can chain ternary operators? What will they think of next? */}
              {solvedAnswers[i] === true
                ? "✅"
                : solvedAnswers[i] === false
                ? "❌"
                : ""}
            </span>
          </>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div>
      <pre>
        <code>{renderTemplate()}</code>
      </pre>
    </div>
  );
};

export { QuizQuestion };

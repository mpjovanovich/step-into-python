import React, { useState } from "react";

interface QuizQuestionProps {
  questionTemplate: string;
  userAnswers: string[];
  setUserAnswers: (answers: string[]) => void;
  // onCheckAnswer: (correct: boolean) => void;
}

/* **********************************************************************
 * This has the fill-in-the-blank code functionality, as well as the
 * "Check" button to see if the answer is correct.
 ************************************************************************/
const QuizQuestion = ({
  questionTemplate,
  userAnswers,
  setUserAnswers,
}: // onCheckAnswer,
QuizQuestionProps) => {
  // These are the actual answers provided via the template.
  const answers =
    questionTemplate.match(/{{(.*?)}}/g)?.map((p) => p.slice(2, -2)) || [];

  const checkAnswer = () => {
    const isCorrect =
      answers.length === userAnswers.length &&
      answers.every((answer, i) => answer === userAnswers[i]);
    // onCheckAnswer(isCorrect);
  };

  const renderTemplate = () => {
    // Split the template into parts, ignoring the {{}}
    const parts = questionTemplate.split(/{{.*?}}/);

    // Stubs in an input field for each {{}} in the template
    return parts.map((part, i) => (
      <React.Fragment key={i}>
        {/* The readonly part of the template */}
        {part}
        {/* The input field for the user's answer */}
        {/* Don't render for the last part in the template */}
        {i < answers.length && (
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
            style={{ width: "120px" }}
          />
        )}
      </React.Fragment>
    ));
  };

  return (
    <div>
      <pre>
        <code>{renderTemplate()}</code>
        {/* <button onClick={checkAnswer}>Check</button> */}
      </pre>
    </div>
  );
};

export { QuizQuestion };

import React, { useState } from "react";

interface QuizQuestionProps {
  questionTemplate: string;
  // onAnswer: (answer: string) => void;
}

const QuizQuestion = ({ questionTemplate }: QuizQuestionProps) => {
  const [textInput, setTextInput] = useState("");
  const InputField = (
    <input
      type="text"
      value={textInput}
      onChange={(e) => setTextInput(e.target.value)}
      style={{ width: "120px" }}
    />
  );

  const renderTemplate = () => {
    // Split the template into parts, ignoring the {{}}
    const parts = questionTemplate.split(/{{.*?}}/);

    // The values in the {{}} are the correct answers.
    const answers =
      questionTemplate.match(/{{(.*?)}}/g)?.map((p) => p.slice(2, -2)) || [];

    // Stubs in an input field for each {{}} in the template
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
        {index < parts.length - 1 && InputField}
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

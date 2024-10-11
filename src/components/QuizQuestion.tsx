import React, { useState } from 'react';

enum InputType {
  Number = 'number',
  Text = 'text',
  Select = 'select'
}

interface QuizQuestionProps {
  questionTemplate: string;
  inputType: InputType;
  selectOptions?: string[];
  onAnswer: (answer: string) => void;
}

const QuizQuestion = ({ 
    questionTemplate,
    onAnswer,
    inputType,
    selectOptions,
}: QuizQuestionProps) => {
  const [textInput, setTextInput] = useState('');

  const handleAnswer = () => {
    if (inputType === InputType.Text) {
      onAnswer(textInput.trim());
    }
  };

  const renderInput = () => {
    if (inputType === InputType.Number) {
        return (
            <input  
                type="number"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value.trim())}
                style={{ width: '50px' }}
            />
        )
    } else if (inputType === InputType.Text) {
      return (
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value.trim())}
          style={{ width: '50px' }}
        />
      );
    } else if (inputType === InputType.Select && selectOptions) {
      return (
        <select
          onChange={(e) => onAnswer(e.target.value)}
          style={{ width: 'auto', minWidth: '50px' }}
        >
          <option value=""></option>
          {selectOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }
    return null;
  };

  const renderTemplate = () => {
    const parts = questionTemplate.split('{{}}');
    return (
      <>
        {parts[0]}
        {renderInput()}
        {parts[1]}
      </>
    );
  };

  return (
    <div>
      <pre>
        <code>{renderTemplate()}</code>
      </pre>
      {inputType === InputType.Text && (
        <button type="button" onClick={handleAnswer}>
          Run
        </button>
      )}
    </div>
  );
};

export { QuizQuestion, InputType };

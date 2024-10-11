import React, { useState } from 'react';

interface QuizQuestionProps {
  questionTemplate: string;
  onAnswer: (answer: string) => void;
}

const QuizQuestion = ({ 
    questionTemplate,
    onAnswer 
}: QuizQuestionProps) => {
  const [userInput, setUserInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnswer(userInput);
  };

  // Currently only supports one {{}} in the template
  const renderTemplate = () => {
    const parts = questionTemplate.split('{{}}');
    return (
      <>
        {parts[0]}
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          style={{ width: '50px' }}
        />
        {parts[1]}
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <pre>
        <code>{renderTemplate()}</code>
      </pre>
      <button type="submit">Submit</button>
    </form>
  );
};

export default QuizQuestion;
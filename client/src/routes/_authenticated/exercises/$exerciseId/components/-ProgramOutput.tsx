import styles from "../route.module.css";
import CodeCopyButton from "./-CodeCopyButton";
import CodeHighlight from "./-CodeHighlight";
import CodeInput from "./-CodeInput";
import CodeInputResult from "./-CodeInputResult";

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
  return (
    <div className={styles.output}>
      <CodeCopyButton copyCode={copyCode} />
      <CodeHighlight
        code={code}
        renderAnswerSlot={(answerIndex) => (
          <span className="inline-flex-wrapper">
            <CodeInput
              value={userAnswers[answerIndex] ?? ""}
              answer={answers[answerIndex] ?? ""}
              autoFocus={answerIndex === 0}
              onChange={(e) => {
                // This spreads the current answers into a new array so that we
                // can mutate it, updates the answer at the current index, and
                // sets the new array as state for the user's answers.
                const newAnswers = [...userAnswers];
                newAnswers[answerIndex] = e.target.value;
                setUserAnswers(newAnswers);
              }}
            />
            <CodeInputResult result={checkAnswerResults[answerIndex] === true} />
          </span>
        )}
      />
    </div>
  );
};

export default ProgramOutput;

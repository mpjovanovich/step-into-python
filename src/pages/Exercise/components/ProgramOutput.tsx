import React from "react";
import { MdCheck, MdClose } from "react-icons/md";
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
  // currentStep: number;
  // questionTemplate: string;
  // needsCheck: boolean;
  // setNeedsCheck: (needsCheck: boolean) => void;
  // setExerciseState: (state: ExerciseState) => void;
}

/* **********************************************************************
 * This has the fill-in-the-blank code functionality, as well as the
 * "Check" button to see if the answer is correct.
 ************************************************************************/
// Render helpers
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
            {checkAnswerResults[i] !== null &&
              checkAnswerResults[i] === true && (
                <MdCheck color="green" style={{ fontSize: "1.2rem" }} />
              )}
            {checkAnswerResults[i] !== null &&
              checkAnswerResults[i] === false && (
                <MdClose color="red" style={{ fontSize: "1.2rem" }} />
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
  return (
    <div className={styles.output}>
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

  // // Helper functions
  // const getTemplate = (): Template => {
  //   let template = `## EXERCISE: ${title}\n`;
  //   let answers: string[] = [];

  //   // Make a currentTemplate string that only includes lines up to the step.
  //   questionTemplate.split("\n").forEach((line) => {
  //     const [stepRange, code] = line.split("?");

  //     // Here the step will be in either the format "1?" or "1:2?"
  //     // In the former case we assume the line is to be kept for the rest of the program.
  //     // In the latter case we assume the line is to be kept up to the specified end step (inclusive).
  //     const stepParts = stepRange.split(":");
  //     const startStep = parseInt(stepParts[0]);
  //     const endStep = stepParts.length > 1 ? parseInt(stepParts[1]) : 9999;

  //     if (startStep < currentStep && endStep >= currentStep) {
  //       template += code.replaceAll("@@", "") + "\n";
  //     } else if (startStep === currentStep) {
  //       template += code + "\n";

  //       // Use the regex to find the answers in the code.
  //       let matches = code.match(BLANK_REGEX);
  //       if (matches) {
  //         // Strip the @@ from the answers
  //         const mapped = matches.map((p) => p.slice(2, -2));
  //         answers.push(...mapped);
  //       }
  //     }
  //   });

  //   return {
  //     code: template,
  //     copyCode: template.replace(/@@[^@]+@@/g, ""),
  //     answers: answers,
  //   };
  // };

  // // State
  // const [copyText, setCopyText] = useState("Copy");
  // const [userAnswers, setUserAnswers] = useState<string[]>([]);
  // const [userAnswerResults, setUserAnswerResults] = useState<
  //   (boolean | null)[]
  // >([]);
  // const isResetting = useRef(false);

  // // Template initialization
  // const template = getTemplate();

  // // Technically this doesn't belong here since this is a view, but I'm keeping
  // // it here for now.
  // const checkAnswers = () => {
  //   const results = template.answers.map((answer, i) =>
  //     // The best way I can think of to handle whitespace is to just remove all of it.
  //     // We need to allow for, e.g., 'x = 5' and 'x=5 ' to be considered correct.
  //     // Maybe later we can add a more sophisticated check for correctness.
  //     userAnswers[i]
  //       ? answer.replace(/\s+/g, "") === userAnswers[i].replace(/\s+/g, "")
  //       : null
  //   );
  //   setUserAnswerResults(results);

  //   // If there are no questions, this will still work.
  //   const hasUnansweredQuestions = results.some((answer) => !answer);
  //   setExerciseState(
  //     hasUnansweredQuestions ? "STEP_INCOMPLETE" : "STEP_COMPLETE"
  //   );
  //   setNeedsCheck(false);
  // };

  // // Effects
  // useEffect(() => {
  //   isResetting.current = true;
  //   setUserAnswers([]);
  // }, [currentStep]);

  // useEffect(() => {
  //   // Most of the time we don't want to check the answers. Only do it if this
  //   // was in response to a step change.
  //   if (isResetting.current) {
  //     checkAnswers();
  //     isResetting.current = false;
  //   }
  // }, [userAnswers]);

  // useEffect(() => {
  //   if (needsCheck) {
  //     checkAnswers();
  //   }
  // }, [needsCheck]);

  // Render
  // return (
  //   <div className={styles.output}>
  //     <button
  //       className={styles.copyButton}
  //       onClick={() => {
  //         navigator.clipboard.writeText(template.copyCode);
  //         setCopyText("Copied!");
  //         setTimeout(() => setCopyText("Copy"), 800);
  //       }}
  //     >
  //       {copyText === "Copied!" ? <MdCheck /> : <MdContentCopy />} {copyText}
  //     </button>

  //     <div>
  //       <pre>
  //         <code>{renderTemplate()}</code>
  //       </pre>
  //     </div>
  //   </div>
  // );
};

export { ProgramOutput };

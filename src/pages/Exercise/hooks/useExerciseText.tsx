import { MdCheckCircle } from "react-icons/md";

interface UseExerciseTextParams {
  currentStep: number;
  finalStep: number;
  description?: string;
  instructions?: string;
}

interface UseExerciseTextReturn {
  formattedDescription: React.ReactNode;
  formattedInstructions: React.ReactNode;
}

function formatDescription(
  currentStep: number,
  finalStep: number,
  description: string
): React.ReactNode {
  if (currentStep === 0) {
    return (
      <>
        <p>In this exercise you will complete a Python program step by step.</p>
        <p>
          The code window on the right will show the code for the current step.
          It will sometimes have a section for you to complete.
        </p>
        <p>
          At any step you may use the &quot;Copy&quot; button from the code
          window and paste the output into VS Code or another Python interpreter
          to see the current output. This can help with debugging and
          understanding the flow of execution.
        </p>
      </>
    );
  }

  if (currentStep === finalStep + 1) {
    return (
      <>
        <p>
          Your program is complete. Try copying and pasting it into a Python
          interpreter to see if it works.
        </p>
        <p>Make sure to click Submit!</p>
      </>
    );
  }

  if (currentStep > finalStep + 1) {
    return (
      <>
        <span className="inline-flex-wrapper">
          <MdCheckCircle className="icon-complete" />
          <span
            style={{
              marginTop: "10px",
              marginLeft: "8px",
              marginBottom: "10px",
            }}
          >
            Exercise Complete!
          </span>
        </span>
      </>
    );
  }

  return (
    <>
      {description.split("\n").map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </>
  );
}

function formatInstructions(
  currentStep: number,
  finalStep: number,
  instructions: string
): React.ReactNode {
  if (currentStep === finalStep + 1) {
    return <p>Click Submit</p>;
  }

  if (currentStep > finalStep + 1) {
    return <p>Click Home to return to the home page.</p>;
  }

  if (instructions) {
    return (
      <>
        {instructions.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </>
    );
  }

  return <p>Click Next to continue</p>;
}

export function useExerciseText({
  currentStep,
  finalStep,
  description = "",
  instructions = "",
}: UseExerciseTextParams): UseExerciseTextReturn {
  return {
    formattedDescription: formatDescription(
      currentStep,
      finalStep,
      description
    ),
    formattedInstructions: formatInstructions(
      currentStep,
      finalStep,
      instructions
    ),
  };
}

import { StepType } from "../../../types/StepType";

function formatInstructions(
  stepType: StepType,
  instructions: string
): React.ReactNode {
  // If instructions are provided, format them as a list of paragraphs.
  if (instructions.length > 0) {
    return (
      <>
        {instructions.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </>
    );
  }

  // If no instructions are provided, return the appropriate text for the step type.
  switch (stepType) {
    case StepType.START:
    case StepType.EXERCISE:
      return <p>Click Next to continue</p>;
    case StepType.SUBMIT:
      return <p>Click Submit</p>;
    case StepType.COMPLETE:
      return <p>Click Home to return to the home page.</p>;
  }
}

const ExerciseInstructions = ({
  stepType,
  instructions,
}: {
  stepType: StepType;
  instructions: string;
}) => {
  return (
    <>
      <h3>Instructions</h3>
      {formatInstructions(stepType, instructions)}
    </>
  );
};

export default ExerciseInstructions;

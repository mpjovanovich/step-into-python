import { ExerciseStepType } from "../../../types/ExerciseStepType";

function formatInstructions(
  stepType: ExerciseStepType,
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
    case ExerciseStepType.START:
    case ExerciseStepType.EXERCISE:
      return <p>Click Next to continue</p>;
    case ExerciseStepType.SUBMIT:
      return <p>Click Submit</p>;
    case ExerciseStepType.COMPLETE:
      return <p>Click Home to return to the home page.</p>;
  }
}

const ExerciseInstructions = ({
  stepType,
  instructions,
}: {
  stepType: ExerciseStepType;
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

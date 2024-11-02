interface ExerciseTextProps {
  step: number;
  maxStep: number;
  descriptions: Record<number, string>;
  instructions: Record<number, string>;
}

export const ExerciseText = ({
  step,
  maxStep,
  descriptions,
  instructions,
}: ExerciseTextProps) => {
  const getDescription = (): JSX.Element => {
    if (step === 0) {
      return (
        <>
          <p>
            In this exercise you will complete a Python program step by step.
          </p>
          <p>
            The code window on the right will show the code for the current
            step. It will sometimes have a section for you to complete.
          </p>
          <p>
            At any step you may use the "Copy" button from the code window and
            paste the output into VS Code or another Python interpreter to see
            the current output. This can help with debugging and understanding
            the flow of execution.
          </p>
        </>
      );
    } else if (step === maxStep + 1) {
      return (
        <>
          <p>
            Your program is complete. Try copying and pasting it into a Python
            interpreter to see if it works!
          </p>
          <p>Make sure to click Submit!</p>
        </>
      );
    }

    return <p>{descriptions[step]}</p>;
  };

  const getInstructions = (): string => {
    if (step === maxStep + 1) {
      return "Click Submit";
    }
    return instructions[step] ?? "Click Next to continue";
  };

  return (
    <>
      <h3>Description</h3>
      {getDescription()}
      <h3>Instructions</h3>
      <p>{getInstructions()}</p>
    </>
  );
};

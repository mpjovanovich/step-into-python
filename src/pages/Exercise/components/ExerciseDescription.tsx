interface ExerciseDescriptionProps {
  step: number;
  maxStep: number;
  descriptions: Record<number, string>;
}

export const ExerciseDescription = ({
  step,
  maxStep,
  descriptions,
}: ExerciseDescriptionProps) => {
  if (step === 0) {
    return (
      <>
        <p>In this exercise you will complete a Python program step by step.</p>
        <p>
          The code window on the right will show the code for the current step.
          It will sometimes have a section for you to complete.
        </p>
        <p>
          At any step you may use the "Copy" button from the code window and
          paste the output into VS Code or another Python interpreter to see the
          current output. This can help with debugging and understanding the
          flow of execution.
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

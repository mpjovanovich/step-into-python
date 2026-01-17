import { ExerciseStepType } from "@/types/ExerciseStepType";
import { MdCheckCircle } from "react-icons/md";

function formatDescription(
  stepType: ExerciseStepType,
  description: string
): React.ReactNode {
  switch (stepType) {
    case ExerciseStepType.START:
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
            At any step you may use the &quot;Copy&quot; button from the code
            window and paste the output into VS Code or another Python
            interpreter to see the current output. This can help with debugging
            and understanding the flow of execution.
          </p>
        </>
      );

    case ExerciseStepType.EXERCISE:
      return (
        <>
          {description?.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </>
      );

    case ExerciseStepType.SUBMIT:
      return (
        <>
          <p>
            Your program is complete. Try copying and pasting it into a python
            interpreter to see if it works.
          </p>
          <p>Make sure to click Submit!</p>
        </>
      );

    case ExerciseStepType.COMPLETE:
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
}

const ExerciseDescription = ({
  stepType,
  description,
}: {
  stepType: ExerciseStepType;
  description: string;
}) => {
  return (
    <>
      <h3>Description</h3>
      {formatDescription(stepType, description)}
    </>
  );
};

export default ExerciseDescription;

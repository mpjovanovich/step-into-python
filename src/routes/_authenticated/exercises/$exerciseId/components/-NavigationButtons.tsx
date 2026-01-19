import { ExerciseButtonType } from "@/types/ExerciseButtonType";
import { ExerciseStepType } from "@/types/ExerciseStepType";
import styles from "../route.module.css";
import { getButtonStates } from "../utils/-ButtonStateUtils";

const NavigationButtons = ({
  stepType,
  allCorrect,
  canFocus,
  onPrevious,
  onNext,
  onSubmit,
}: {
  stepType: ExerciseStepType;
  allCorrect: boolean;
  canFocus: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) => {
  const buttons = getButtonStates(stepType, allCorrect);
  const previous = buttons.get(ExerciseButtonType.PREVIOUS);
  const next = buttons.get(ExerciseButtonType.NEXT);
  const submit = buttons.get(ExerciseButtonType.SUBMIT);

  return (
    <div className={styles.buttonContainer}>
      {previous?.visible && (
        <button
          key={ExerciseButtonType.PREVIOUS}
          className={styles.actionButton}
          onClick={onPrevious}
          disabled={!previous.enabled}
          autoFocus={canFocus && previous.hasFocus}
        >
          Previous
        </button>
      )}
      {next?.visible && (
        <button
          key={ExerciseButtonType.NEXT}
          className={styles.actionButton}
          onClick={onNext}
          disabled={!next.enabled}
          autoFocus={canFocus && next.hasFocus}
        >
          Next
        </button>
      )}
      {submit?.visible && (
        <button
          key={ExerciseButtonType.SUBMIT}
          className={styles.actionButton}
          onClick={onSubmit}
          disabled={!submit.enabled}
          autoFocus={canFocus && submit.hasFocus}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;

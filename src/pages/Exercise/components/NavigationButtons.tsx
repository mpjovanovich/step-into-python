import styles from "../Exercise.module.css";

interface NavigationButtonsProps {
  step: number;
  maxStep: number;
  checkButtonVisible: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onCheck: () => void;
  // onSubmit: () => void;
}

export const NavigationButtons = ({
  step,
  maxStep,
  checkButtonVisible,
  onPrevious,
  onNext,
  onCheck,
}: NavigationButtonsProps) => {
  const buttons = [];

  // Previous button (when needed)
  if (step > 0) {
    buttons.push(
      <button key="prev" className={styles.actionButton} onClick={onPrevious}>
        Previous
      </button>
    );
  }

  // Next button (when needed)
  if (step < maxStep) {
    buttons.push(
      <button key="next" className={styles.actionButton} onClick={onNext}>
        Next
      </button>
    );
  }

  // Check button
  if (checkButtonVisible) {
    buttons.push(
      <button key="check" className={styles.actionButton} onClick={onCheck}>
        Check
      </button>
    );
  }

  // // Action button (Submit/Next/Check)
  // if (solvedAnswers.every((correct) => correct) && step === maxStep + 1) {
  //   buttons.push(
  //     <button key="submit" className={styles.actionButton} onClick={onSubmit}>
  //       Submit
  //     </button>
  //   );
  // } else if (solvedAnswers.every((correct) => correct) && step <= maxStep) {
  //   buttons.push(
  //     <button key="next" className={styles.actionButton} onClick={onNext}>
  //       Next
  //     </button>
  //   );
  // } else if (solvedAnswers.some((correct) => !correct)) {
  //   buttons.push(
  //     <button key="check" className={styles.actionButton} onClick={onCheck}>
  //       Check
  //     </button>
  //   );
  // }

  return <div className={styles.buttonContainer}>{buttons}</div>;
};

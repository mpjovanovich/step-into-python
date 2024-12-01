import { Link } from "react-router-dom";
import { MdCheckCircle } from "react-icons/md";
import styles from "../Exercise.module.css";
import type { ExerciseState } from "../../../types/Exercise";

interface NavigationButtonsProps {
  currentStep: number;
  finalStep: number;
  exerciseState: ExerciseState;
  onPrevious: () => void;
  onNext: () => void;
  onCheck: () => void;
  onSubmit: () => Promise<void>;
}

// This is a dumb view component that renders the navigation buttons.
// There should be no logic here.
export const NavigationButtons = ({
  currentStep,
  finalStep,
  exerciseState,
  onPrevious,
  onNext,
  onCheck,
  onSubmit,
}: NavigationButtonsProps) => {
  console.log("exerciseState", exerciseState);
  console.log("currentStep", currentStep);
  console.log("finalStep", finalStep);

  return (
    <div className={styles.buttonContainer}>
      {currentStep > 0 && exerciseState !== "COMPLETED" && (
        <button
          className={styles.actionButton}
          onClick={onPrevious}
          disabled={exerciseState === "SUBMITTING"}
        >
          Previous
        </button>
      )}

      {exerciseState === "STEP_INCOMPLETE" && (
        <button className={styles.actionButton} onClick={onCheck}>
          Check
        </button>
      )}

      {exerciseState === "STEP_COMPLETE" && currentStep < finalStep + 1 && (
        <button className={styles.actionButton} onClick={onNext}>
          Next
        </button>
      )}

      {exerciseState === "STEP_COMPLETE" && currentStep === finalStep + 1 && (
        <button className={styles.actionButton} onClick={onSubmit}>
          Submit
        </button>
      )}

      {exerciseState === "SUBMITTING" && (
        <button className={styles.actionButton} disabled>
          Submitting...
        </button>
      )}

      {exerciseState === "COMPLETED" && (
        <>
          <span className="inline-flex-wrapper">
            <MdCheckCircle className="icon-complete" />
            <span style={{ marginLeft: "8px" }}>Exercise Complete!</span>
          </span>
          <button className={styles.actionButton}>
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              Home
            </Link>
          </button>
        </>
      )}
    </div>
  );
};

import styles from "../ExercisePage.module.css";
import { type ButtonState } from "../hooks/useNavigationButtons";

interface NavigationButtonsProps {
  buttons: ButtonState[];
}

// This is a dumb view component that renders the navigation buttons.
// There should be no logic here.
export const NavigationButtons = ({ buttons }: NavigationButtonsProps) => {
  return (
    <div className={styles.buttonContainer}>
      {buttons
        .filter((button) => button.visible)
        .map((button) => (
          <button
            key={button.text}
            className={styles.actionButton}
            onClick={button.onClick}
            disabled={!button.enabled}
          >
            {button.text}
          </button>
        ))}
    </div>
  );
};

{
  /* {currentStep > 0 && exerciseState !== "COMPLETED" && ( */
}
{
  /* <button
        className={styles.actionButton}
        onClick={onPrevious}
        // disabled={exerciseState === "SUBMITTING"}
      >
        Previous
      </button> */
}
{
  /* )} */
}

{
  /* {exerciseState === "STEP_INCOMPLETE" && (
        <button className={styles.actionButton} onClick={onCheck}>
          Check
        </button>
      )} */
}

{
  /* {exerciseState === "STEP_COMPLETE" && currentStep < finalStep + 1 && ( */
}
{
  /* <button
        className={styles.actionButton}
        onClick={onNext}
        disabled={hasUnansweredQuestions}
      >
        Next
      </button> */
}
{
  /* )} */
}

{
  /* {exerciseState === "STEP_COMPLETE" && currentStep === finalStep + 1 && ( */
}
{
  /* <button className={styles.actionButton} onClick={onSubmit}>
        Submit
      </button> */
}
{
  /* )} */
}

{
  /* {exerciseState === "SUBMITTING" && ( */
}
{
  /* <button className={styles.actionButton} disabled>
        Submitting...
      </button> */
}
{
  /* )} */
}

{
  /* {exerciseState === "COMPLETED" && (
        <>
          <span className="inline-flex-wrapper">
            <MdCheckCircle className="icon-complete" />
            <span style={{ marginLeft: "8px" }}>Exercise Complete!</span>
          </span>
          <Link to="/" style={{ textDecoration: "none" }}>
            <button className={styles.actionButton}>Home</button>
          </Link>
        </>
      )} */
}
